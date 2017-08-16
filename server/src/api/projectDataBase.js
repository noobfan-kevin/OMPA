/**
 * Created by HK059 on 2016/4/18.
 */
var express = require('express');
var router = module.exports = express.Router();
var projectDataBaseService = require('../service/projectDataBaseService');
var projectService = require('../service/projectService');
var assetInfoService = require('../service/assetInfoService');
var contentDisposition = require('content-disposition');
var config=require('../config.js');//config
var fs = require('fs');
var path = require('path');
var utils = require('../core/utils');
var async = require('async');
var io = process.core.io;
/**
 * @api {post} /api/projectDataBase/upload 上传接口
 * @apiName UploadFile
 * @apiGroup ProjectDataBase
 * @apiPermission all
 *
 * @apiParam {File}  file 需要上传的文件
 * @apiParam {Number}  sourceType 来源类型
 * @apiParam {String}  sourceKey 来源主键编号
 *
 * @apiSuccess {String} originalName 上传文件原文件名
 * @apiSuccess {String} filename 上传后的文件名
 * @apiSuccess {String} path 上传后的文件相对路径
 * @apiSuccess {String} ext 文件后缀名
 * @apiSuccess {String} size 文件大小
 * @apiSuccess {String} sourceKey 来源主键编号
 * @apiSuccess {Number} sourceType 来源类型
 * @apiSuccess {String} authorId 上传作者
 * @apiSuccess {Date} time 上传时间
 *
 */
router.post('/upload',function(req, res, next){
    var projectFiles = req.files['projectFiles']&&req.files['projectFiles'][0];
    var fileInfo = req.files['fileInfo']&&req.files['fileInfo'][0];
    var  file =  projectFiles || fileInfo;
    if(file) {
        if(req.body.fatherId){
            var user = req.session.user;
            var imgExt = ['png','jpg','jpeg','gif','bmp'];
            file.originalName = file.originalname;
            file.parentId = req.body.fatherId;
            file.creatorId = req.body.creatorId;
            file.projectId = req.body.projectId;
            file.projectName = req.body.projectName;
            file.fileId = req.body.fileId;
            file.isFolder = false;
            if(user){    // session停用
                file.creatorId = user.id;
            }
            projectDataBaseService.getById(file.parentId).then(function(folder){
                var index=null;
                var originalNames = [];
                var imgStoragePath = path.join(__dirname, '../../../client-x64/app/images/fileFormat/'+file.extension+'.gif');
                if(folder!==null){
                    index=folder.dataValues.index;
                    originalNames = JSON.parse(folder.dataValues.originalNames);
                }else{
                    originalNames = [file.projectName + '_' + file.projectId];
                }
                originalNames.push(file.originalName);
                if(fs.existsSync(imgStoragePath)) {
                    for (var i = 0; i < imgExt.length; i++) {
                        if (file.extension.toLowerCase() === imgExt[i]) {
                            var imgName = ~~(Math.random() * 1000) + Date.now() + '.' + file.extension;
                            var filePath = path.join(__dirname, '../../fileExplorers/fileInfo/') + imgName;
                            console.log(filePath);
                            var data = fs.readFileSync(file.path);
                            fs.writeFile(filePath, data, function (err) {
                                if (!err) {
                                    console.log('写入成功！');
                                }
                            });
                            file.imgPath = 'fileInfo' + '/' + imgName;
                        }
                    }
                }else{
                    file.extension = 'default';
                }
                file.index=index;
                file.originalNames = JSON.stringify(originalNames);
                projectDataBaseService.create(file).then(function (dbFile) {
                    res.json(dbFile);
                });
            }).catch(function(error){
                next(error);
            });
        }else if(req.body.fileId){
            /*var change = {
                imgPath : 'fileInfo' + '/' + file.filename
            };
            projectDataBaseService.updateById(req.body.fileId,change).then(function(file){
                res.json(file);
            });*/
            res.json(file);
        }/*else{
            if(req.body.groupId)
            {
                file.sourceKey = req.body.groupId;
                file.creatorId = req.body.creatorId;
            }
            projectDataBaseService.create(file).then(function (dbFile) {

                // 更新项目缩略图
                if(req.body.projectId){
                    projectService.updateById(req.body.projectId,{"projectImg":dbFile.name}).then(function() {
                        res.json(dbFile);
                    })
                }else if(req.body.assetId){
                    assetInfoService.updateById(req.body.assetId,{"assetImg":dbFile.name}).then(function() {
                        res.json(dbFile);
                    })
                }
                else{
                    res.json(dbFile);
                }


            }).catch(function(err){
                next(err);
            })
        }*/
    } else {
        var err = new Error("file must not be null!");
        err.status = 500;
        next(err);
    }
});

/**
 * @api {get} /api/projectDataBase/download/:name 下载文件接口
 * @apiName downloadFile
 * @apiGroup ProjectDataBase
 * @apiPermission all
 *
 * @apiParam (params) {String}  name 下载的文件名
 *
 * @apiSuccess {File} file 下载的文件
 *
 */
router.get('/download/:id', function(req, res, next){

    var id = req.params.id;
    projectDataBaseService.getById(id).then(function (dbFile) {
        var data = fs.readFileSync(dbFile.path);
        res.setHeader('Content-Disposition', contentDisposition(dbFile.originalName));
        res.setHeader('Content-Length', data.length/1000);
        res.send(data);
    }).catch(function(err){
        next(err);
    });

});

/**
 * @api {get} /api/projectDataBase 获取文件列表
 * @apiName GetFileList
 * @apiGroup ProjectDataBase
 * @apiPermission all
 *
 * @apiParam {Object} [conditions={}] 查询条件
 * @apiParam {String} [fields=""] 查询字段
 * @apiParam {Object} [options={}] 查询选项，分页、排序
 *
 * @apiParamExample {json} 请求用户aa上传的文件:
 *  {
 *      conditions: {authorId：'aa'}
 *  }
 *
 * @apiSuccess {Array} list 文件数组
 *
 */
router.get('/project/:projectId', function (req, res, next) {

    var projectId = req.params.projectId;
    projectDataBaseService.getByProjectId(projectId,true).then(function (list) {
        res.result = {ok: true, desc: '查询列表'};
        res.json(list);
    }).catch(function(err){
        next(err);
    });
});

//TODO 针对ZTree定制数据API folder
/**
 * @editor kevin
 * 此接口是为了满足封装的ZTree插件要求的数据格式不做他用
 */
router.get('/folderInfo/:projectId/:projectName', function (req, res, next) {

    var projectId = req.params.projectId;
    var projectName = req.params.projectName;
    projectDataBaseService.getByProjectId(projectId,true).then(function (list) {
        var _data = [{
            id:projectId,
            name:projectName
        }];
        var len = list.length;
        for(var i=0;i<len;i++){
            _data.push({
                id:list[i].id,
            fatherId:list[i].parentId,
            name:list[i].originalName});
        }
        res.json({list:_data});
    }).catch(function(err){
        next(err);
    });
});
/**
 * @api {get} /api/projectDataBase/:fileId 查询文件信息
 * @apiName GetFile
 * @apiGroup ProjectDataBase
 * @apiPermission all
 *
 * @apiParam {String} fileId 文件Id
 *
 * @apiSuccess {String} originalName 上传文件原文件名
 * @apiSuccess {String} filename 上传后的文件名
 * @apiSuccess {String} path 上传后的文件相对路径
 * @apiSuccess {String} ext 文件后缀名
 * @apiSuccess {String} size 文件大小
 * @apiSuccess {String} sourceKey 来源主键编号
 * @apiSuccess {Number} sourceType 来源类型
 * @apiSuccess {String} authorId 上传作者
 * @apiSuccess {Date} time 上传时间
 *
 */
router.get('/:fileId',function (req, res, next) {
    var fileId = req.params.fileId;
    console.log(fileId);
    projectDataBaseService.getById(fileId).then(function (dbFile) {
        ////console.log(dbFile);
        res.json(dbFile);
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {delete} /api/projectDataBase/:fileId 删除文件
 * @apiName DeleteFile
 * @apiGroup ProjectDataBase
 * @apiPermission all
 *
 * @apiParam {String} fileId 文件Id
 *
 * @apiSuccess {Boolean} ok 删除操作是否成功
 *
 */
router.delete('/:fileId', function (req, res, next) {
    var fileId = req.params.fileId;
    var name = req.body.name;
    var projectId = req.body.projectId;
    var projectRootPath;
    if (fileId !== 'projectRoot') {
        projectDataBaseService.getById(fileId).then(function (dbfile) {
            if (!dbfile.dataValues.isFolder) {
                var filePath = dbfile.dataValues.path;
                projectDataBaseService.deleteById(fileId).then(function () {
                    if (fs.existsSync(filePath)){
                        fs.unlink(filePath);
                    }
                    res.json({ok: true});
                });
            }
            else {
                var deletePath = JSON.parse(dbfile.dataValues.originalNames).join('/');
                deletePath = path.join(__dirname, '../../fileExplorers/' + deletePath);
                projectDataBaseService.deleteByIndex(projectId,dbfile.dataValues.index).then(function () {
                    deleteFolderRecursive(deletePath);
                    res.json({ok: true});
                });
            }
        }).catch(function (error) {
            next(error);
        });
        return;
    }
    projectRootPath = path.join(__dirname, '../../fileExplorers/'+name+'_'+projectId);
    projectDataBaseService.deleteByProjectId().then(function () {
        deleteFolderRecursive(projectRootPath);
        res.json({ok: true});
    });
    //在服务器上删除文件夹
    function deleteFolderRecursive(path) {
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }
});
/**
 * @api {get} /api/projectDataBase/father/:fatherId 查询文件信息
 * @apiName GetFile
 * @apiGroup ProjectDataBase
 * @apiPermission all
 *
 * @apiParam {String} fatherId 文件Id
 *
 * @apiSuccess {String} originalName 上传文件原文件名
 * @apiSuccess {String} filename 上传后的文件名
 * @apiSuccess {String} path 上传后的文件相对路径
 * @apiSuccess {String} ext 文件后缀名
 * @apiSuccess {String} size 文件大小
 * @apiSuccess {String} sourceKey 来源主键编号
 * @apiSuccess {Number} sourceType 来源类型
 * @apiSuccess {String} authorId 上传作者
 * @apiSuccess {Date} time 上传时间
 *
 */
router.get('/father/:fatherId',function (req, res, next) {
    var fatherId = req.params.fatherId;
    var order=req.query.order;
    console.log("==========349========="+fatherId);
    projectDataBaseService.getByFatherId(fatherId,order).then(function(files){
        res.json(files);
    }).catch(function(error){
        next(error);
    });
    /*projectDataBaseService.getByFatherId(fatherId, function (err, dbFile) {
     if (err) {
     next(err);
     } else {
     //console.log(dbFile);
     res.json(dbFile);
     }
     });*/
});

/*router.post('/getFileChild/',function (req, res, next) {
    //console.log("========365===========");
    //console.log(req.body);
    var fatherId = req.body.node;
    if(fatherId.indexOf("folderId_")>=0)
    {
        fatherId=fatherId.replace("folderId_","");
    }

    var order="ASC";
    projectDataBaseService.getByFatherId(fatherId,order).then(function(files) {
        var result = [];
        for (var i = 0; i < files.length; i++) {
            if(files[i].dataValues.isFolder){
                result.push(files[i].dataValues);
            }
        }
        //console.log(result);
        projectDataBaseService.arrangeFolderTree(result).then(function(result2){
            //console.log(result2);
            //res.json(files);
            var filearray=[];
            for(var i=0;i<result2.length;i++){
                //{"text":"air","id":"\/air","cls":"folder","leaf":false}
                /!*
                 treeNode.put("allowAppend", true);
                 treeNode.put("leaf", true);
                 treeNode.put("allowDelete", true);
                 treeNode.put("allowModify", true);
                 * *!/
                //console.log(result2[i].child);
                //"folderId_"+ folderId
                var node={
                    id:"folderId_"+result2[i].id,
                    text:result2[i].originalName
                };
                //console.log(result2[i].child);
                if(!checkFile(result2[i].child))//result2[i].child.length>0)
                {
                    node.leaf=true;
                }
                else{
                    node.leaf=false;
                }
                filearray.push(node);
            }
            //console.log(filearray)
            res.json(filearray);
        });
    }).catch(function(error){
        console.log(error);
        next(error);
    });
    function checkFile(files){
        var flag=false;
        for(var i=0;i<files.length;i++)
        {
            if(files[i].dataValues.isFolder)
            {
                flag=true;
            }
        }
        return flag;
    }
});*/
/**
 * @api {get} /api/projectDataBase/folderAll/:fatherId 查询文件信息
 * @apiName GetFile
 * @apiGroup ProjectDataBase
 * @apiPermission all
 *
 * @apiParam {String} fatherId 文件Id
 *
 * @apiSuccess {String} originalName 上传文件原文件名
 * @apiSuccess {String} filename 上传后的文件名
 * @apiSuccess {String} path 上传后的文件相对路径
 * @apiSuccess {String} ext 文件后缀名
 * @apiSuccess {String} size 文件大小
 * @apiSuccess {String} sourceKey 来源主键编号
 * @apiSuccess {Number} sourceType 来源类型
 * @apiSuccess {String} authorId 上传作者
 * @apiSuccess {Date} time 上传时间
 *
 */
/*router.get('/folderAll/:fatherId',function (req, res, next) {
    var fatherId = req.params.fatherId;
    var father={
        _id:fatherId,
        isFolder:true
    };
    projectDataBaseService.queryFoldersByFather(father, function (err, dbFile) {
        if (err) {
            next(err);
        } else {
            //console.log(dbFile);
            res.json(dbFile);
        }
    });

});*/
/**
 * @api {post} /api/projectDataBase/newFolder 添加目录
 * @apiName newFolder
 * @apiGroup ProjectDataBase
 * @apiPermission all
 *
 * @apiParam {String}  name 文件夹名称

 *
 * @apiSuccess {String} originalName 上传文件原文件名
 * @apiSuccess {String} filename 上传后的文件名
 * @apiSuccess {String} path 上传后的文件相对路径
 * @apiSuccess {String} ext 文件后缀名
 * @apiSuccess {String} size 文件大小
 * @apiSuccess {String} sourceKey 来源主键编号
 * @apiSuccess {Number} sourceType 来源类型
 * @apiSuccess {String} authorId 上传作者
 * @apiSuccess {Date} time 上传时间
 *
 */
router.post('/newFolder',function (req, res, next) {
    var folderName = req.body.name;
    var fatherId = req.body.fatherId;
    var projectName = req.body.projectName;
    var projectId = req.body.projectId;
    var creatorId = req.body.creatorId;
    var folderPath;
    var projectRootPath;
    if(fatherId !== 'projectRoot'){
        projectDataBaseService.getById(fatherId).then(function(dbfile){
            if(dbfile===null){
                var parentIdArray=[];
                var parentNameArray=[];
                parentIdArray.push(fatherId);
                parentNameArray.push(projectName+'_'+projectId,folderName);
                folderPath = projectName+'_'+projectId+'/'+folderName;//fatherId === projectId
                folderPath = path.join(__dirname, '../../fileExplorers/'+folderPath);
                projectDataBaseService.queryFolderSon(fatherId).then(function(files){
                    if(files.length !== 0){
                        var index = getIndex(files);
                    }else {
                        index = 1;
                    }
                    var dbFile={
                        parentId:fatherId,
                        isFolder:true,
                        parentIds:JSON.stringify(parentIdArray),
                        originalName:folderName,
                        originalNames:JSON.stringify(parentNameArray),
                        index:index + ',',
                        projectId:projectId,
                        creatorId: creatorId
                    };
                    projectDataBaseService.create(dbFile).then(function(fl){
                        if (!fs.existsSync(folderPath)) {
                            fs.mkdirSync(folderPath);
                        }
                        res.json({ok: true, info:fl.dataValues});
                    });
                });
            }
            else{
                var parentIds=JSON.parse(dbfile.dataValues.parentIds);
                parentIds.push(dbfile.id);
                var index=dbfile.dataValues.index;
                var parentNames = JSON.parse(dbfile.dataValues.originalNames);
                parentNames.push(folderName);
                folderPath = parentNames.join('/');
                folderPath = path.join(__dirname, '../../fileExplorers/'+folderPath);
                projectDataBaseService.queryFolderSon(fatherId).then(function(files){
                    if(files.length !== 0){
                        var count = getIndex(files);
                    }else {
                        count = 1;
                    }
                    index=index+count+',';
                    var dbFile={
                        parentId:fatherId,
                        isFolder:true,
                        parentIds:JSON.stringify(parentIds),
                        originalName:folderName,
                        originalNames:JSON.stringify(parentNames),
                        index:index,
                        projectId:projectId,
                        creatorId: creatorId
                    };
                    projectDataBaseService.create(dbFile).then(function(fl){
                        if (!fs.existsSync(folderPath)) {
                            fs.mkdirSync(folderPath);
                        }
                        res.json({ok: true, info:fl.dataValues});
                    });
                });
            }
        }).catch(function(err){
            next(err);
        });
        return;
    }
    //项目根目录不存入数据库
    projectRootPath = path.join(__dirname, '../../fileExplorers/'+folderName)+'_'+projectId;
    if (!fs.existsSync(projectRootPath)) {
        fs.mkdirSync(projectRootPath);
    }
    res.json({ok: true});
    function getIndex(files){
        var indexNumber = [];
        files.forEach(function(file){
            var indexArr = file.dataValues.index.split(',');
            indexNumber.push(parseInt(indexArr[indexArr.length - 2]));
        });
        indexNumber.sort(function(n1,n2){
            return n2 - n1;
        });
        return indexNumber[0] + 1;
    }
});

/**
 * @api {post} /api/projectDataBase/update 修改文件文件夹信息接口
 * @apiName update
 * @apiGroup ProjectDataBase
 * @apiPermission all
 *
 * @apiParam {String}  name 文件夹或文件名称

 *
 * @apiSuccess {Boolean} ok 修改操作是否成功
 *
 */

router.post('/update',function (req, res, next) {
    var folderName = req.body.newName;
    var fileId = req.body.fileId;
    var oldName = req.body.oldName;
    var projectId = req.body.projectId;
    var newRootPath;
    var oldRootPath;
    var originalNames;
    var folderPath;
    var length;
    var change;
    var type;
    var title;
    var description;
    var imgPath;
    if(fileId !== 'projectRoot'){
        if(folderName !== 'undefined') {
            projectDataBaseService.getById(fileId).then(function (dbFile) {
                folderPath = JSON.parse(dbFile.dataValues.originalNames);
                folderPath.pop();
                folderPath = folderPath.join('/');
                oldName = oldName || dbFile.dataValues.originalName;
                newRootPath = path.join(__dirname, '../../fileExplorers/' + folderPath + '/' + folderName);
                oldRootPath = path.join(__dirname, '../../fileExplorers/' + folderPath + '/' + oldName);
                projectDataBaseService.queryFolderSon(dbFile.dataValues.parentId, true).then(function (files) {
                    var flag = true;
                    for (var i = 0; i < files.length; i++) {
                        if (fileId !== files[i].dataValues.id && files[i].dataValues.originalName === folderName) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        var originalNameChange = {
                            originalName: folderName
                        };
                        projectDataBaseService.updateById(fileId, originalNameChange).then(function () {
                            if (fs.existsSync(oldRootPath)) {
                                fs.rename(oldRootPath, newRootPath);
                            }
                            if (dbFile.dataValues.isFolder) {
                                length = dbFile.dataValues.index.split(',').length - 1;
                                projectDataBaseService.queryFolderFilesByFather(dbFile).then(function (folderFiles) {
                                    folderFiles.forEach(function (folderFile) {
                                        originalNames = JSON.parse(folderFile.dataValues.originalNames);
                                        originalNames.splice(length, 1, folderName);
                                        change = {
                                            originalNames: JSON.stringify(originalNames)
                                        };
                                        if (!folderFile.dataValues.isFolder) {
                                            change.path = path.join(__dirname, '../../fileExplorers/' + originalNames.join('/'));
                                        }
                                        projectDataBaseService.updateById(folderFile.dataValues.id, change);
                                    });
                                    res.json({ok: true, name: folderName, isFolder: true, id: fileId});
                                });
                            } else {
                                originalNames = JSON.parse(dbFile.dataValues.originalNames);
                                originalNames.splice(originalNames.length - 1, 1, folderName);
                                change = {
                                    path: newRootPath,
                                    originalNames: JSON.stringify(originalNames)
                                };
                                projectDataBaseService.updateById(fileId, change).then(function () {
                                    res.json({ok: true, name: folderName, isFolder: false});
                                });
                            }
                        });
                    }
                    else {
                        res.json({ok: false, info: "该文件或目录已经存在！", name: oldName});
                    }
                });
            }).catch(function (error) {
                next(error)
            });
            return;
        }
        type = req.body.type;
        title = req.body.title;
        description = req.body.description;
        imgPath = req.body.imgPath;
        change = {
            type : type,
            title : title,
            description : description,
            imgPath : imgPath
        };
        projectDataBaseService.updateById(fileId, change).then(function(){
            res.json({ok: true, type : type, title : title, description : description});
        }).catch(function (error) {
            next(error)
        });
        return;
    }
    //项目根目录重命名
    newRootPath = path.join(__dirname, '../../fileExplorers/'+folderName)+'_'+projectId;
    oldRootPath = path.join(__dirname, '../../fileExplorers/'+oldName)+'_'+projectId;
    projectDataBaseService.getByProjectId(projectId).then(function(folderFiles){
        folderFiles.forEach(function(folderFile){
            originalNames = JSON.parse(folderFile.dataValues.originalNames);
            originalNames.splice(0, 1, folderName + '_' + projectId);
            change = {
                originalNames: JSON.stringify(originalNames)
            };
            if(!folderFile.dataValues.isFolder) {
                change.path = path.join(__dirname, '../../fileExplorers/'+originalNames.join('/'));
            }
            projectDataBaseService.updateById(folderFile.dataValues.id, change);
        });
    }).then(function(){
        if (fs.existsSync(oldRootPath)) {
            fs.rename(oldRootPath, newRootPath);
        }
        res.json({ok: true});
    }).catch(function (error) {
        next(error);
    });
});

/**
 * @api {post} /api/projectDataBase/cutFile 剪切接口
 * @apiName cutFile
 * @apiGroup ProjectDataBase
 * @apiPermission all
 *
 * @apiParam {String}  name 文件夹或文件名称

 *
 * @apiSuccess {Boolean} ok 修改操作是否成功
 *
 */
router.post('/cutFile',function (req, res, next) {
    var fatherid = req.body.fatherid;
    var fileid = req.body.fileid;
    var creatorId = req.body.creatorId;
    var projectId;
    var createCount = 0;
    var allDeleteCount;
    if(fileid===fatherid){
        res.json({ok: false, info:"目标文件夹与源文件夹不能相同"});
    }
    else{
        projectDataBaseService.getById(fileid).then(function(dbfile){
            //console.log(dbfile);
            if(dbfile.dataValues.parentId===fatherid){
                console.log('不要在当前文件夹上进行剪切操作');
                res.json({ok: false, info:'不要在当前文件夹上进行剪切操作'});
            }else{
                var name = dbfile.dataValues.originalName;
                projectId = dbfile.dataValues.projectId;
                if (dbfile.dataValues.isFolder) {
                    projectDataBaseService.getById(fatherid).then(function (folder) {
                        var flag = true;
                        var parentArray = [];
                        if (folder !== null) {
                            parentArray = JSON.parse(folder.dataValues.parentIds);
                        }
                        for (var i = 0; i < parentArray.length; i++) {
                            if (fileid === parentArray[i]) {
                                flag = false;
                                break;
                            }
                        }
                        if (!flag) {
                            res.json({ok: false, info: "目标文件夹是源文件夹的子文件夹"});
                        }
                        else {
                            projectDataBaseService.getByOriginalNameAndFatherId(fatherid,dbfile.dataValues.originalName,true).then(function(isExist) {
                                projectDataBaseService.queryFolderSon(fatherid).then(function (files) {
                                    projectDataBaseService.queryFolderFilesByFather(dbfile).then(function (allFiles) {
                                        allDeleteCount = allFiles.length;
                                        if(files.length !== 0){
                                            var count = getIndex(files);
                                        }else {
                                            count = 1;
                                        }
                                        var index = "";//folder.dataValues.index;
                                        var parents;
                                        var originalNames;
                                        if (folder !== null) {
                                            index = folder.dataValues.index;
                                            parents = JSON.parse(folder.dataValues.parentIds);
                                            originalNames = JSON.parse(folder.dataValues.originalNames);
                                        } else {
                                            parents = [];
                                            originalNames = [];
                                            originalNames.push(JSON.parse(dbfile.dataValues.originalNames)[0]);
                                        }
                                        index = index + count + ",";
                                        parents.push(fatherid);
                                        if (isExist.length > 0) {
                                            name = getFolderNewName(files, name);
                                        }
                                        originalNames.push(name);
                                        var dbFile2 = {
                                            originalName: name,
                                            originalNames: JSON.stringify(originalNames),
                                            parentId: fatherid,
                                            parentIds: JSON.stringify(parents),
                                            isFolder: true,
                                            index: index,
                                            projectId: projectId,
                                            creatorId: creatorId
                                        };
                                        projectDataBaseService.create(dbFile2).then(function (fl) {
                                            var oldPath = path.join(__dirname, '../../fileExplorers/') + JSON.parse(dbfile.dataValues.originalNames).join('/');
                                            var newPath = path.join(__dirname, '../../fileExplorers/') + originalNames.join('/');
                                            if(fs.existsSync(oldPath)) {
                                                fs.rename(oldPath, newPath);
                                            }
                                            if(allDeleteCount>1){
                                                createCount++;
                                                sonFolder(dbfile.dataValues.id, fl);//fl.dataValues.id);
                                            }else{
                                                projectDataBaseService.deleteById(fileid);
                                                res.json({ok: true, info: fl});
                                            }
                                            function sonFolder(sourceid,targetfolder){
                                                projectDataBaseService.getByFatherId(sourceid).then(function(files){
                                                    var n = 0;
                                                    ////console.log(files);
                                                    for(var i=0;i<files.length;i++) {
                                                        var dbFile2;
                                                        var index = targetfolder.dataValues.index;
                                                        var originalNames = JSON.parse(targetfolder.dataValues.originalNames);
                                                        originalNames.push(files[i].dataValues.originalName);
                                                        var folderPath = path.join(__dirname, '../../fileExplorers/')+originalNames.join('/');
                                                        if(files[i].dataValues.isFolder){
                                                            var parents=JSON.parse(targetfolder.dataValues.parentIds);
                                                            parents.push(targetfolder.dataValues.id);
                                                            dbFile2={
                                                                originalName:files[i].dataValues.originalName,
                                                                originalNames:JSON.stringify(originalNames),
                                                                parentId:targetfolder.dataValues.id,
                                                                parentIds:JSON.stringify(parents),
                                                                isFolder:true,
                                                                creatorId:creatorId,
                                                                index:index+(i+1)+',',
                                                                projectId: projectId
                                                            };
                                                        }else{
                                                            dbFile2={
                                                                originalName:files[i].dataValues.originalName,
                                                                originalNames:JSON.stringify(originalNames),
                                                                path:folderPath,
                                                                parentId:targetfolder.dataValues.id,
                                                                isFolder:false,
                                                                size:files[i].dataValues.size,
                                                                creatorId:creatorId,
                                                                index:index,
                                                                type: files[i].dataValues.type,
                                                                title: files[i].dataValues.title,
                                                                description: files[i].dataValues.description,
                                                                imgPath: files[i].dataValues.imgPath,
                                                                projectId: projectId,
                                                                extension: files[i].dataValues.extension
                                                            };
                                                        }
                                                        projectDataBaseService.create(dbFile2).then(function(fl){
                                                            n++;
                                                            createCount++;
                                                            if(createCount===allDeleteCount){
                                                                projectDataBaseService.deleteByIndex(projectId,dbfile.dataValues.index);
                                                                res.json({ok: true, info: fl});
                                                                return;
                                                            }
                                                            //console.log(fls)
                                                            ////console.log(files[i].dataValues)
                                                            if(fl.dataValues.isFolder) {
                                                                sonFolder(files[n - 1].dataValues.id, fl);//fl.dataValues.id);
                                                            }
                                                        });
                                                    }
                                                }).catch(function(error){
                                                    console.log("734:"+error);
                                                });
                                            }
                                        });
                                    });
                                });
                            });
                        }
                    });
                }
                else {
                    projectDataBaseService.getById(fatherid).then(function (folder){
                        projectDataBaseService.getByOriginalNameAndFatherId(fatherid,dbfile.dataValues.originalName,false).then(function(isExist) {
                            projectDataBaseService.queryFileSon(fatherid).then(function (files) {
                                //console.log(files);
                                var index = null;//folder.dataValues.index;
                                var originalNames;
                                var filePath;
                                if (folder !== null) {
                                    index = folder.dataValues.index;
                                    originalNames = JSON.parse(folder.dataValues.originalNames);
                                }else{
                                    originalNames = [];
                                    originalNames.push(JSON.parse(dbfile.dataValues.originalNames)[0]);
                                }
                                if (isExist.length > 0) {
                                    name = getFileNewName(files, name);
                                }
                                originalNames.push(name);
                                filePath = path.join(__dirname, '../../fileExplorers/') + originalNames.join('/');
                                //console.log(name);
                                var dbFile2 = {
                                    originalName: name,
                                    originalNames:JSON.stringify(originalNames),
                                    path: filePath,
                                    parentId: fatherid,
                                    isFolder: false,
                                    size: dbfile.dataValues.size,
                                    creatorId: creatorId,
                                    index: index,
                                    type: dbfile.dataValues.type,
                                    title: dbfile.dataValues.title,
                                    description: dbfile.dataValues.description,
                                    imgPath: dbfile.dataValues.imgPath,
                                    projectId: projectId,
                                    extension: dbfile.dataValues.extension
                                };
                                projectDataBaseService.create(dbFile2).then(function (fl) {
                                    //不确定是否正确
                                    /*var data = fs.readFileSync(dbfile.dataValues.path);
                                    fs.writeFile(filePath, data, function (err) {
                                        if (!err) {
                                            console.log('写入成功！');
                                        }
                                    });*/
                                    var readable = fs.createReadStream(dbfile.dataValues.path);
                                    var writable = fs.createWriteStream(filePath);
                                    readable.pipe( writable );
                                    projectDataBaseService.deleteById(fileid).then(function () {
                                        if(fs.existsSync(dbfile.dataValues.path)) {
                                            fs.unlink(dbfile.dataValues.path);
                                        }
                                        res.json({ok: true, info: fl});
                                    });
                                });
                            });
                        });
                    })
                }

            }

        }).catch(function(error){
            next(error);
        });
    }
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
    function getIndex(files){
        var indexNumber = [];
        files.forEach(function(file){
            var indexArr = file.dataValues.index.split(',');
            indexNumber.push(parseInt(indexArr[indexArr.length - 2]));
        });
        indexNumber.sort(function(n1,n2){
            return n2 - n1;
        });
        return indexNumber[0] + 1;
    }
});

/**
 * @api {post} /api/projectDataBase/copyFile 复制接口
 * @apiName copyFile
 * @apiGroup ProjectDataBase
 * @apiPermission all
 *
 * @apiParam {String}  name 文件夹或文件名称

 *
 * @apiSuccess {Boolean} ok 修改操作是否成功
 *
 */
router.post('/copyFile',function (req, res, next) {
    var fatherid = req.body.fatherid;
    var fileid = req.body.fileid;
    var creatorId = req.body.creatorId;
    var projectId;
    if(fileid===fatherid)
    {
        res.json({ok: false, info:"目标文件夹与源文件夹不能相同"});
    }
    else
    {
        projectDataBaseService.getById(fileid).then(function(dbfile){
            var name = dbfile.dataValues.originalName;
            projectId = dbfile.dataValues.projectId;
            if (dbfile.dataValues.isFolder) {
                projectDataBaseService.getById(fatherid).then(function (folder) {
                    var flag = true;
                    var parentArray = [];
                    if (folder !== null) {
                        parentArray = JSON.parse(folder.dataValues.parentIds);
                    }
                    for (var i = 0; i < parentArray.length; i++) {
                        if (fileid === parentArray[i]) {
                            flag = false;
                            break;
                        }
                    }
                    if (!flag) {
                        res.json({ok: false, info: "目标文件夹是源文件夹的子文件夹"});
                    }
                    else {
                        projectDataBaseService.getByOriginalNameAndFatherId(fatherid,dbfile.dataValues.originalName,true).then(function(isExist){
                            projectDataBaseService.queryFolderSon(fatherid).then(function (files) {
                                projectDataBaseService.queryFilesByFather(dbfile).then(function(allFiles){
                                    var filesCount = allFiles.length;
                                    console.log(filesCount);
                                    if(files.length !== 0){
                                        var count = getIndex(files);
                                    }else {
                                        count = 1;
                                    }
                                    var index = '';//folder.dataValues.index;
                                    var parents;
                                    var originalNames;
                                    if (folder !== null) {
                                        index = folder.dataValues.index;
                                        parents = JSON.parse(folder.dataValues.parentIds);
                                        originalNames = JSON.parse(folder.dataValues.originalNames);
                                    }else{
                                        parents =[];
                                        originalNames = [];
                                        originalNames.push(JSON.parse(dbfile.dataValues.originalNames)[0]);
                                    }
                                    index = index + count + ",";
                                    parents.push(fatherid);
                                    if (isExist.length>0) {
                                        name = getFolderNewName(files, name);
                                    }
                                    originalNames.push(name);
                                    var dbFile2 = {
                                        originalName: name,
                                        originalNames: JSON.stringify(originalNames),
                                        parentId: fatherid,
                                        parentIds: JSON.stringify(parents),
                                        isFolder: true,
                                        index: index,
                                        projectId: projectId,
                                        creatorId: creatorId
                                    };
                                    projectDataBaseService.create(dbFile2).then(function (fl) {
                                        sonFolder(dbfile.dataValues.id, fl);//fl.dataValues.id);
                                        var oldPath = path.join(__dirname, '../../fileExplorers/') + JSON.parse(dbfile.dataValues.originalNames).join('/');
                                        var newPath = path.join(__dirname, '../../fileExplorers/') + originalNames.join('/');
                                        exists(oldPath, newPath, copy);
                                        if(filesCount === 0) {
                                            res.json({ok: true, info: fl});
                                        }
                                        var stat = fs.stat;
                                        var fileComplete = 0;
                                        //复制文件
                                        function copy(src,dst){
                                            // 读取目录中的所有文件/目录
                                            fs.readdir(src,function(err,paths){
                                                if(err){
                                                    throw err;
                                                }
                                                paths.forEach(function(path){
                                                    var _src = src + '/' + path,
                                                        _dst = dst + '/' + path,
                                                        readable, writable;
                                                    stat(_src, function(err,st){
                                                        if(err){
                                                            throw err;
                                                        }
                                                        // 判断是否为文件
                                                        if(st.isFile()){
                                                            // 创建读取流
                                                            readable = fs.createReadStream(_src);
                                                            // 创建写入流
                                                            writable = fs.createWriteStream(_dst);
                                                            // 通过管道来传输流
                                                            readable.pipe(writable);
                                                            writable.on('close',function(){
                                                                fileComplete++;
                                                                io.emit('receive','ok');
                                                                if(fileComplete===filesCount) {
                                                                    res.json({ok: true, info: fl});
                                                                }
                                                            });
                                                        }
                                                        // 如果是目录则递归调用自身
                                                        else if(st.isDirectory()){
                                                            exists(_src,_dst,copy);
                                                        }
                                                    });
                                                });
                                            });
                                        }
                                        //在复制目录前需要判断该目录是否存在，不存在需要先创建目录
                                        function exists( src, dst, callback ){
                                            fs.exists( dst, function( exists ){
                                                // 已存在
                                                if( exists ){
                                                    callback( src, dst );
                                                }
                                                // 不存在
                                                else{
                                                    fs.mkdir(dst,function(){
                                                        callback( src, dst );
                                                    });
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    }
                });
            }
            else {
                projectDataBaseService.getById(fatherid).then(function (folder) {
                    projectDataBaseService.getByOriginalNameAndFatherId(fatherid,dbfile.dataValues.originalName,false).then(function(isExist){
                        projectDataBaseService.queryFileSon(fatherid).then(function (files) {
                    //console.log(files);
                            var index = null;//folder.dataValues.index;
                            var originalNames;
                            var filePath;
                            if (folder !== null) {
                                index = folder.dataValues.index;
                                originalNames = JSON.parse(folder.dataValues.originalNames);
                            }else{
                                originalNames = [];
                                originalNames.push(JSON.parse(dbfile.dataValues.originalNames)[0]);
                            }
                            if (isExist.length>0) {
                                name = getFileNewName(files, name);//name+"("+(new Date().getTime())+")";
                            }
                            originalNames.push(name);
                            filePath = path.join(__dirname, '../../fileExplorers/') + originalNames.join('/');
                            var dbFile2 = {
                                originalName: name,
                                originalNames: JSON.stringify(originalNames),
                                path: filePath,
                                parentId: fatherid,
                                isFolder: false,
                                size: dbfile.dataValues.size,
                                creatorId: creatorId,
                                index: index,
                                type: dbfile.dataValues.type,
                                title: dbfile.dataValues.title,
                                description: dbfile.dataValues.description,
                                imgPath: dbfile.dataValues.imgPath,
                                projectId: projectId,
                                extension: dbfile.dataValues.extension
                            };
                            projectDataBaseService.create(dbFile2).then(function (fl) {
                                var readable = fs.createReadStream(dbfile.dataValues.path);
                                var writable = fs.createWriteStream(filePath);
                                readable.pipe( writable );
                                writable.on('close',function(){
                                    io.emit('receive','ok');
                                    res.json({ok: true, info: fl});
                                });
                            });
                        });
                    });
                })
            }
        }).catch(function(error){
            next(error);
        });
    }
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
    function sonFolder(sourceid,targetfolder){
        projectDataBaseService.getByFatherId(sourceid).then(function(files){
            var n = 0;
            ////console.log(files);
            for(var i=0;i<files.length;i++) {
                var dbFile2;
                var index=targetfolder.dataValues.index;
                var originalNames = JSON.parse(targetfolder.dataValues.originalNames);
                originalNames.push(files[i].dataValues.originalName);
                var folderPath = path.join(__dirname, '../../fileExplorers/')+originalNames.join('/');
                if(files[i].dataValues.isFolder){
                    var parents=JSON.parse(targetfolder.dataValues.parentIds);
                    parents.push(targetfolder.dataValues.id);
                    dbFile2={
                        originalName:files[i].dataValues.originalName,
                        originalNames:JSON.stringify(originalNames),
                        parentId:targetfolder.dataValues.id,
                        parentIds:JSON.stringify(parents),
                        isFolder:true,
                        creatorId:creatorId,
                        index:index+(i+1)+',',
                        projectId: projectId
                    };
                }else{
                    dbFile2={
                        originalName:files[i].dataValues.originalName,
                        originalNames:JSON.stringify(originalNames),
                        path:folderPath,
                        parentId:targetfolder.dataValues.id,
                        isFolder:false,
                        size:files[i].dataValues.size,
                        creatorId:creatorId,
                        index:index,
                        type: files[i].dataValues.type,
                        title: files[i].dataValues.title,
                        description: files[i].dataValues.description,
                        imgPath: files[i].dataValues.imgPath,
                        projectId: projectId,
                        extension: files[i].dataValues.extension
                    };
                }
                projectDataBaseService.create(dbFile2).then(function(fl){
                    n++;
                    //console.log(fls)
                    ////console.log(files[i].dataValues)
                    if(fl.dataValues.isFolder) {
                        sonFolder(files[n - 1].dataValues.id, fl);//fl.dataValues.id);
                    }
                });
            }
        }).catch(function(error){
            console.log("734:"+error);
        });
    }
    function getIndex(files){
        var indexNumber = [];
        files.forEach(function(file){
            var indexArr = file.dataValues.index.split(',');
            indexNumber.push(parseInt(indexArr[indexArr.length - 2]));
        });
        indexNumber.sort(function(n1,n2){
            return n2 - n1;
        });
        return indexNumber[0] + 1;
    }
});
/**
 * @api {get} /api/projectDataBase/searchFile 搜索接口
 * @apiName searchFile
 * @apiGroup ProjectDataBase
 * @apiPermission all
 *
 * @apiParam {String}  str 关键字

 *
 * @apiSuccess {Boolean} ok 修改操作是否成功
 *
 */
router.get('/searchFile/:fatherId',function(req, res, next){
    var keyword = req.query.keyword;
    var projectId = req.query.projectId;
    var parentId = req.params.fatherId;
    if (projectId === parentId){
        projectDataBaseService.searchAllFilesByTitle(projectId,keyword).then(function (files) {
            res.json({ok: true, info: files});
        }).catch(function (err) {
            next(err);
        });
    }else {
        projectDataBaseService.getById(parentId).then(function (dbFile) {
            projectDataBaseService.searchFilesByTitle(dbFile, keyword).then(function (files) {
                res.json({ok: true, info: files});
            });
        }).catch(function (err) {
            next(err);
        });
    }
});
/**
 * @api {get} /api/projectDataBase/checkFileType 检测文件类型接口
 * @apiName checkFileType
 * @apiGroup ProjectDataBase
 * @apiPermission all
 *
 * @apiParam {String}  str 关键字

 *
 * @apiSuccess {Boolean} ok 修改操作是否成功
 *
 */
router.get('/checkFileType/:typeId',function(req, res, next){
    var typeId = req.params.typeId;
    projectDataBaseService.checkFileType(typeId).then(function(files){
        if(files.length === 0){
            res.json({ok: true, result: true});
        }else{
            res.json({ok: true, result: false, info: '该类型下存在文件，不可删除！'});
        }
    }).catch(function (err) {
        next(err);
    });
});
/**
 * @api {get} /api/projectDataBase/getFileCount 获取文件个数接口
 * @apiName getFileCount
 * @apiGroup ProjectDataBase
 * @apiPermission all
 *
 * @apiParam {String}  str 文件夹ID

 *
 * @apiSuccess {Boolean} ok 修改操作是否成功
 *
 */
router.get('/getFileCount/:folderId',function(req, res, next){
    var folderId = req.params.folderId;
    projectDataBaseService.getById(folderId).then(function(folder){
        projectDataBaseService.queryFilesByFather(folder).then(function(files){
            res.json(files.length);
        });
    }).catch(function (err) {
        next(err);
    });
});

/**
 * @api {delete} /api/projectDataBase/transferFile 转移文件
 * @apiName transferFile
 * @apiGroup projectDataBase
 * @apiPermission all
 *
 * @apiParam {String} oldPath 文件路径
 * @apiParam {String} originalName 文件原始名
 * @apiParam {String} fatherId 文件夹名称
 * @apiParam {String} projectName 项目名称
 * @apiParam {String} size 文件大小
 *
 *
 * @apiSuccess {Boolean} ok 转移操作是否成功
 *
 */
router.post('/transferFile',function(req, res, next){
    var file = {};
    var imgExt = ['png','jpg','jpeg','gif','bmp'];
    var oldPath = path.join(__dirname,'../../uploads/'+req.body.oldPath);
    file.creatorId = req.session.user.id;
    file.originalName = req.body.originalName;
    file.parentId = req.body.fatherId;
    file.projectName = req.body.projectName;
    file.size = req.body.size;
    file.isFolder = false;
    if(file.originalName.indexOf('.') !== -1){
        file.extension = file.originalName.substring(file.originalName.lastIndexOf('.')+1);
    }else{
        file.extension = 'default';
    }
    projectDataBaseService.getById(file.parentId).then(function(folder){
        projectDataBaseService.getByOriginalNameAndFatherId(file.parentId,file.originalName,false).then(function(isExist) {
            projectDataBaseService.queryFileSon(file.parentId).then(function (files) {
                var index = null;
                var originalNames = [];
                var projectId;
                var imgStoragePath = path.join(__dirname, '../../../client-x64/app/images/fileFormat/' + file.extension + '.gif');
                if (folder !== null) {
                    index = folder.dataValues.index;
                    projectId = folder.projectId;
                    originalNames = JSON.parse(folder.dataValues.originalNames);
                } else {
                    projectId = file.parentId;
                    originalNames = [file.projectName + '_' + projectId];
                }
                if (isExist.length>0) {
                    file.originalName = getFileNewName(files, file.originalName);//name+"("+(new Date().getTime())+")";
                }
                originalNames.push(file.originalName);
                file.path = path.join(__dirname, '../../fileExplorers/') + originalNames.join('/');
                if (fs.existsSync(imgStoragePath)) {
                    for (var i = 0; i < imgExt.length; i++) {
                        if (file.extension.toLowerCase() === imgExt[i]) {
                            var imgName = ~~(Math.random() * 1000) + Date.now() + '.' + file.extension;
                            var filePath = path.join(__dirname, '../../fileExplorers/fileInfo/') + imgName;
                            var data = fs.readFileSync(oldPath);
                            fs.writeFile(filePath, data, function (err) {
                                if (!err) {
                                    console.log('写入成功！');
                                }
                            });
                            file.imgPath = 'fileInfo' + '/' + imgName;
                        }
                    }
                } else {
                    file.extension = 'default';
                }
                file.index = index;
                file.originalNames = JSON.stringify(originalNames);
                file.projectId = projectId;
                projectDataBaseService.create(file).then(function (dbFile) {
                    var fileData = fs.readFileSync(oldPath);
                    fs.writeFile(file.path, fileData, function (err) {
                        if (!err) {
                            console.log('写入成功！');
                        }
                    });
                    res.json(dbFile);
                });
            });
        });
    }).catch(function(error){
        next(error);
    });
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
});