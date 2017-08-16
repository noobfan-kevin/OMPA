/**
 * Created by yang on 14/12/9.
 */
var path = require('path');

var config = module.exports = {};
var dbServer = 'localhost';
config.dbConfig ={
    dialect   : 'postgres',
    host     : dbServer,
    user     : 'postgres',
    password : '123456',
    database : 'ompa_Enterprise',
    charset  : 'utf8',
    quoteIdentifiers: true,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logging: console.log,
    importDB: false,    // 导入外部数据
    reCreateDB: false
};
/*config.logDB ={
    db:  +新建用户
 'mongodb://'+dbServer+':27017/ompa',

    collection: 'logs',
    showLevel: false,
    options:{
        db: {native_parser: true},
        server:{
            poolSize: 2,
            auto_reconnect:true,
            socketOptions:{
                keepAlive:3600000
            }
        }
    }
};*/

config.sessionDB = {

    host: dbServer,

    port: 27017,
    db: 'ompa',
    w: 1,

    // Global options
    collection: 'sessions',
    auto_reconnect: true,
    ssl: false
};

config.dbTestConfig ={
    dialect   : 'postgres',
    host     : dbServer,
    user     : 'postgres',
    password : '123456',
    database : 'ompa-test',
    charset  : 'utf8',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logging:false,
    reCreateDB: false
};


config.portConfig = {
    site: 9527
};

config.uploadPath = path.join(__dirname, '../uploads');   //调用文件的相对路径
//config.uploadPath = path.join('F:','/ompa/uploads');   //绝对路径

config.fileExplorerPath = path.join(__dirname, '../fileExplorers');   //调用文件的相对路径
config.publicDataBasePath = path.join(__dirname, '../publicFileExplorers');   //调用文件的相对路径
config.fileInfo = path.join(__dirname, '../fileExplorers/fileInfo');
config.publicThumbnail = path.join(__dirname, '../publicFileExplorers/publicThumbnail');
config.defaultPaths = ['avatar','file','thumbnail','voucher'];    // uploads文件家目录



config.sessionKey = "123456";

config.pwdKey = 'iloveyou';


config.logPath = path.join(__dirname, '../logs');



