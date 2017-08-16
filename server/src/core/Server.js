/**
 * Created by yang on 15/1/8.
 */

var http = require('http');
var path = require('path');
var fs = require('fs');
var domain = require('domain');
var config = require('../config');
var express = require('express');
var utils = require('./utils');
var db = require('./db');
var log = require('./Logger');
var auth = require('./auth');
var _ = require('lodash');
var contentDisposition = require('content-disposition');
var userLog = require('./userLog');

module.exports = Server = function(name,port){
    this.name = name;//app name
    this.port = port;//app port
    this.utils = utils;
    this.config = config;
    this.log = log;
    this.app = express();
    this.server = http.createServer(this.app);
    process.core = this;
};

Server.prototype.exitProcess = function(){
    process.exit(1);
};

Server.prototype.loadRouters = function(){
    this.warn(this.name + ' loadRouters doing nothing!');
};

Server.prototype.connectDB = function () {
    var that = this;
    if (!process.core ) {
        process.core = this;
    }
    return db.loadModels().then(function(){
        that.db = db;
    });
};

Server.prototype.useCookieParser = function(){
    /*
     * 启用cookie解析
     * */
    var cookieParser = require('cookie-parser');
    this.app.use(cookieParser(config.sessionKey));
};

Server.prototype.useBodyParser = function(){
    /*
     * 启动body解析
     * */
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    this.app.use(bodyParser.urlencoded({ extended: false, limit:'1000000mb'}));
    this.app.use(bodyParser.json({limit:'1000000mb'}));
    this.app.use(methodOverride());
};

Server.prototype.useMulterUpload = function(){
    /*
     * 上传设置
     * */
    var multer  = require('multer');
    var uploadPath = config.uploadPath;
    var fileExplorerPath = config.fileExplorerPath;
    var fileInfoPath = config.fileInfo;
    var publicDataBasePath = config.publicDataBasePath;
    var publicThumbnail = config.publicThumbnail;
    var storage = multer.diskStorage({

        destination: function (req, file, cb) {
            if(file.fieldname === 'projectFiles'){
                cb(null, fileExplorerPath + '/' + req.body.folderPath);
                return;
            }
            if(file.fieldname === 'fileInfo'){
                cb(null, fileInfoPath);
                return;
            }
            if(file.fieldname === 'publicFiles'){
                cb(null, publicDataBasePath + '/' + req.body.folderPath);
                return;
            }
            if(file.fieldname === 'publicThumbnail'){
                cb(null, publicThumbnail);
                return;
            }
            cb(null, uploadPath + '/' + file.fieldname);

        },
        filename: function(req, file, cb) {
            var fileExt = file.originalname.slice(file.originalname.lastIndexOf('.'));
            var filterString = '.node.js.json.exe.cmd'; // 过滤文件
            var projectDataBaseService = require('../service/projectDataBaseService');
            var publicDataBaseService = require('../service/publicDataBaseService');
            file.extension = fileExt.substring(1);
            if(file.fieldname === 'projectFiles') {
                projectDataBaseService.getByOriginalNameAndFatherId(req.body.fatherId, file.originalname,false).then(function (files) {
                    if (files.length>0) {
                        projectDataBaseService.queryFileSon(req.body.fatherId).then(function (allFiles) {
                            file.originalname = getFileNewName(allFiles, file.originalname);
                            if (filterString.indexOf(fileExt) === -1) {
                                cb(null, file.originalname);
                            } else {
                                file.originalname = file.originalname.slice(0,file.originalname.lastIndexOf(fileExt));
                                cb(null, file.originalname);
                            }
                        });
                    }else{
                        if (filterString.indexOf(fileExt) === -1) {
                            cb(null, file.originalname);
                        } else {
                            file.originalname = file.originalname.slice(0,file.originalname.lastIndexOf(fileExt));
                            cb(null, file.originalname);
                        }
                    }
                });
                return;
            }
            /*if(file.fieldname === 'publicFiles'){
                publicDataBaseService.getByOriginalNameAndFatherId(req.body.fatherId, file.originalname,false).then(function (files) {
                    if (files.length>0) {
                        publicDataBaseService.queryFileSon(req.body.fatherId).then(function (allFiles) {
                            file.originalname = getFileNewName(allFiles, file.originalname);
                            if (filterString.indexOf(fileExt) === -1) {
                                cb(null, file.originalname);
                            } else {
                                file.originalname = file.originalname.slice(0,file.originalname.lastIndexOf(fileExt));
                                cb(null, file.originalname);
                            }
                        });
                    }else{
                        if (filterString.indexOf(fileExt) === -1) {
                            cb(null, file.originalname);
                        } else {
                            cb(null, file.originalname.slice(0,file.originalname.lastIndexOf(fileExt)));
                        }
                    }
                });
                return;
            }*/
            if(filterString.indexOf(fileExt) === -1){
                cb(null, ~~(Math.random()*1000) + Date.now() + fileExt );
            }else{
                cb(null, ~~(Math.random()*1000) + Date.now().toString());
            }
        }
    });
    var upload = multer({
        storage: storage
    });

    this.app.use(upload.fields([
        { name: 'file', maxCount: 1 },
        { name: 'avatar', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'projectFiles', maxCount: 1 },
        { name: 'fileInfo', maxCount: 1 },
        { name: 'publicFiles', maxCount: 1 },
        { name: 'publicThumbnail', maxCount: 1 },
        { name: 'voucher', maxCount: 10 }
    ]));
    function getFileNewName(files,name){
        var result;
        var ext;
        var arr;
        if(name.indexOf('.')!=-1){
            arr = name.split('.');
            ext = '.' + arr[arr.length-1];
        }
        if(ext) {
            result = getFolderNewName(files,name.replace(ext,''),ext)+ext;
        }
        else{
            result = getFolderNewName(files,name);
        }
        return result;
    }
    function getFolderNewName(files,name,ext){
        var originalName;
        var nameCount;
        var result;
        var count = 0;
        for(var i=0;i<files.length;i++){
            originalName = files[i].dataValues.originalName;
            if(ext){
                originalName = originalName.replace(ext,'');
            }
            if(originalName.indexOf(name) === 0){
                nameCount = originalName.replace(name,'');
                if (nameCount.lastIndexOf('(')!==-1&&nameCount.lastIndexOf(')')!==-1) {
                    nameCount = originalName.substring(originalName.lastIndexOf('(') + 1, originalName.lastIndexOf(')'));
                    if (!isNaN(nameCount) && parseInt(nameCount) > count) {
                        count = parseInt(nameCount);
                    }
                }
            }
        }
        count = count + 1;
        result = name +'('+count+')';
        return result;
    }

    //下载路径
    this.app.use('/downloads', express.static(uploadPath, {
        'index': false,
        'setHeaders': function (res, path, states) {
         //   res.setHeader('Content-Type', 'application/force-download');
          //  var str = path.substring(0, path.lastIndexOf('-'))+path.substring( path.lastIndexOf('.'));
            res.setHeader('Content-Disposition', contentDisposition(path));
            res.setHeader('Content-Length', states.size);
        }
    }));

    //静态文件路径
    this.app.use('/', express.static(uploadPath));
};

Server.prototype.useSession = function(){
    /*
     * 启用session机制
     * */
    var session = require('express-session');
    this.app.use(session({
        secret: config.sessionKey,
        saveUninitialized: true,
        cookie: {httpOnly: false},
        resave: true}));

};

Server.prototype.useLocalSession = function(){
    /*
     * 启用自定义session机制
     * */
    var session = require('./localSession');

    // 使用mongodb存储
/*    var MongoStore = require('./MongoStore');
    this.app.use(session({
        storage: new MongoStore(config.sessionDB)
    }));*/

    // 使用postgre存储(未完成测试，请勿使用！)
/*    var PostgreStore = require('./PostgreStore');
    this.app.use(session({
        storage: new PostgreStore()
    }));*/

    // 使用内存存储
    this.app.use( session() );

};

/*Server.prototype.useMongoSession = function(){
    /*
     * 将session存入mongodb防止应用意外重启
     *
     */
   // var session = require('express-session');
    //var MongoStore = require('connect-mongo')(session);
    //var sessionStore =  new MongoStore({
         //autoReconnect: true, // Default
        //w: 1, // Default,
       // ssl: false // Default
  //  });

  /*  this.app.use(session({
        secret: config.sessionKey,
        saveUninitialized: true,
        resave: true
       // store:sessionStore
    }));
};*/

Server.prototype.useAuthenticate = function () {
    /*
     * 读取sid，设置session
     **/
    auth.config.useAuthority = true;    // 启用用户权限验证
    this.app.use(auth.authenticate());
};

Server.prototype.useCrossSetting = function(){
    /*
     *启用跨域限制
     **/
    this.app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With, sid');
        res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Credentials', true);
        res.header('X-Powered-By','3.2.1');//预请求
        res.header('Access-Control-Max-Age','1728000');
        if(req.method === 'OPTIONS'){
            res.sendStatus(200);//让options请求快速返回
        }else{
            next(); //判断用户有没有权限登录该系统，测试阶段先注释掉，后续再回复工功能。
        }
    });
};

Server.prototype.useCoreLogger = function(){
    this.app.use(this.log.logReq('dev'));
};

//业务日志
Server.prototype.useBusinessLogger = function(){
    this.app.use(this.log.logBusiness());
};

Server.prototype.loadFrontend = function(){
    //挂载前端路径
    var fileExplorerPath = config.fileExplorerPath;
    var publicDataBasePath = config.publicDataBasePath;
  //  this.app.use('public', express.static(path.join(utils.getProjectRoot(), 'public')));
    this.app.use(express.static(fileExplorerPath));
    this.app.use(express.static(publicDataBasePath));
    this.app.use(express.static(path.join(utils.getProjectRoot(), 'web')));
    this.app.use(express.static(path.join(utils.getProjectRoot(), 'client-x64/app')));
    this.app.use('help', express.static(path.join(utils.getProjectRoot(), 'help')));
};

//404处理错误
Server.prototype.notFoundHandler = function () {
    this.app.use(function(req, res, next) {
        var err = new Error('请求未找到！');
        err.status = 404;
        next(err);
    });
};


//500+处理错误
Server.prototype.errHandler = function () {
    var that = this;
    this.app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        if (err.status !== 404) {
            that.log.error(err.stack || err.message);
            res.result = {ok: false , desc: err.message};
            res.json({ok: false, message: err.message});
        } else {
            res.send(err.message);
        }
    });
};

//未捕获的异常处理
Server.prototype.uncaughtExceptionHandler = function () {
    var that = this;
    this.app.use(function( req, res, next) {
        var reqDomain = domain.create();
        reqDomain.on('error', function (err) {
            that.log.error(err);
            try {
                var killTimer = setTimeout(function () {
                    process.exit(1);
                }, 10000);
                killTimer.unref();

                that.server.close();

                res.sendStatus(500);
            } catch (e) {
                that.log.error('error when exit', e.stack);
            }
        });

        reqDomain.run(next);
    });

    // uncaughtException 避免程序崩溃
    process.on('uncaughtException', function (err) {
        that.log.error(err);

        try {
            var killTimer = setTimeout(function () {
                process.exit(1);
            }, 10000);
            killTimer.unref();

            that.server.close();
        } catch (e) {
            that.log.error('error when exit', e.stack);
        }
    });
};

Server.prototype.handleError = function () {
    this.notFoundHandler();
    this.errHandler();
};

//TODO
Server.prototype.prepareData = function () {

    if(!config.dbConfig.reCreateDB) return;

    var that = this;
    var userService = require('../service/userService');
    var userData = require('../data/userData');
    var roleService = require('../service/roleService');
    var roleData = require('../data/roleData');
    var authorityService = require('../service/authorityService');
    var authorityData = require('../data/authorityData');
    var departmentService = require('../service/departmentService');
    var departmentData = require('../data/departmentData');
    var sceneInfoService = require('../service/sceneInfoService');
    var sceneData = require('../data/sceneData');
    var assetTypeService= require('../service/assetTypeService');
    var assetsType= require('../data/assetsType');
    var roleAuthorityService = require('../service/roleAuthorityService');
    var partAInfoService = require('../service/partAInfoService');
    var partAInfo = require('../data/partAInfo');
    var fileTypeService = require('../service/fileTypeService');
    var fileType = require('../data/fileType');

    partAInfoService.create(partAInfo.defaultInfo);//创建默认甲方信息
    departmentService.create(departmentData.defaultDepartment); // 创建默认部门
    sceneInfoService.create(sceneData.defaultSceneInfo);  //创建默认集场
    //创建默认资产类型
    fileTypeService.createAll(_.values(fileType)).catch(function(err){
        that.log.error('创建默认文件类型失败！', err);
    });
    //创建默认文件类型
    assetTypeService.createAll(_.values(assetsType)).catch(function(err){
        that.log.error('创建默认资产类型失败！', err);
    });
    authorityService.createAll(_.values(authorityData)).then(function(authorities) {

        roleService.createOneByOne(_.values(roleData), function(){

            // 为所有角色配置默认权限
            roleAuthorityService.init(_.values(roleData)).then(function () {
                roleService.query({where:{name:'高级管理员'}}).then(function(dbAdminRole) {  // 为高级管理员添加默认权限
                    var defaultAdmin = userData.superAdmin;
                    defaultAdmin.roleId = dbAdminRole[0].dataValues.id;
                    userService.createUser(defaultAdmin);
                })
            }).catch(function(err) {
                that.log.error("初始化失败！", err);
            });
        });

    });

    this.createDefaultUploadPaths();
};

Server.prototype.createSocketIO = function () {
    this.io = require('socket.io')(this.server);
    return this;
};

Server.prototype.runServer = function(){
    var scope = this;
    var port =  this.port;
    this.server.setTimeout(0);
    this.server.listen(port,function(){
        scope.log.info(scope.name + ' is listening on port ' + port);
    });
};

Server.prototype.createDefaultUploadPaths = function() {
    var basePath = config.uploadPath;
    var projectDataPath = config.fileExplorerPath;
    var fileInfoPath = config.fileInfo;
    var publicDataBasePath = config.publicDataBasePath;
    var publicThumbnail = config.publicThumbnail;
    var paths = config.defaultPaths;
    var that = this;

    mkdirsSync(basePath);   // 创建 /uploads
    mkdirsSync(projectDataPath);    // 创建 /fileExplorers
    mkdirsSync(fileInfoPath);    // 创建 /fileExplorers/fileInfo
    mkdirsSync(publicDataBasePath);    //创建 /publicDataBasePath
    mkdirsSync(publicThumbnail);    //创建 /publicDataBasePath/publicThumbnail
    paths.forEach(function(dirpath) {
        mkdirsSync(path.join(basePath,dirpath))
    });

    //创建多层文件夹 同步
    function mkdirsSync(dirpath) {
        var pathTemp,
            regDisk = /:$/i;

        dirpath.split(path.sep).forEach(function(dirname) {
            pathTemp = pathTemp ? path.join(pathTemp, dirname) : dirname;
            if (!fs.existsSync(pathTemp) && !regDisk.test(pathTemp)) {  // 不存在且不是磁盘路径(例如："D:")
                fs.mkdirSync(pathTemp);
                that.log.info('创建上传目录：' + pathTemp);
            }
        });
    }
};

Server.prototype.init = function(){
    return new Error(this.name + ' init doing nothing!');
};

Server.prototype._init = function () {
    this.init();
    this.loadRouters();
    this.handleError();

};

// 导入外部数据库
Server.prototype.importDb = function(){
    if(config.dbConfig.importDB){
        var importDB = require('../../import/importDb');
        importDB.importAll();
    }
};

Server.prototype.run = function(){
    var scope = this;
    return scope.connectDB().then(function(){
        scope._init();
        scope.runServer();
    }).catch(function (err) {
        scope.log.error(err.stack);
        scope.exitProcess();
    });
};

Server.prototype.useUserLog = function() {
    this.app.use(userLog.mount());
};









