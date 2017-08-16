/**
 * Created by HK059 on 2016/6/14.
 */
var express = require('express');
var router = module.exports = express.Router();
var publicDataBaseService = require('../service/publicDataBaseService');
var projectService = require('../service/projectService');
var assetInfoService = require('../service/assetInfoService');
var contentDisposition = require('content-disposition');
var config=require('../config.js');//config
var fs = require('fs');
var path = require('path');
var utils = require('../core/utils');
var async = require('async');
/**
 * @api {post} /api/publicDataBase/upload 上传接口
 * @apiName UploadFile
 * @apiGroup publicDataBase
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
    var publicThumbnail = req.files['publicThumbnail']&&req.files['publicThumbnail'][0];
    var publicFiles = req.files['publicFiles']&&req.files['publicFiles'][0];
    var  file =  publicFiles || publicThumbnail;
    if(file) {
        res.json(file);
    } else {
        var err = new Error("file must not be null!");
        err.status = 500;
        next(err);
    }
});

/**
 * @api {get} /api/publicDataBase/download/:name 下载文件接口
 * @apiName downloadFile
 * @apiGroup publicDataBase
 * @apiPermission all
 *
 * @apiParam (params) {String}  name 下载的文件名
 *
 * @apiSuccess {File} file 下载的文件
 *
 */
router.get('/download/:id', function(req, res, next){
    var id = req.params.id;
    publicDataBaseService.getById(id).then(function (dbFile) {
        var data = fs.readFileSync(dbFile.path);
        res.setHeader('Content-Disposition', contentDisposition(dbFile.originalName));
        res.setHeader('Content-Length', data.length/1000);
        res.send(data);
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/publicDataBase/nodeInfo/:fileId 查询节点信息
 * @apiName GetFile
 * @apiGroup publicDataBase
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
router.get('/nodeInfo/:nodeId',function (req, res, next) {
    var nodeId = req.params.nodeId;
    publicDataBaseService.getById(nodeId).then(function (dbFile) {
        res.json(dbFile);
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {delete} /api/publicDataBase/file/:fileId 删除文件
 * @apiName DeleteFile
 * @apiGroup publicDataBase
 * @apiPermission all
 *
 * @apiParam {String} fileId 文件Id
 *
 * @apiSuccess {Boolean} ok 删除操作是否成功
 *
 */
router.delete('/file/:fileId', function (req, res, next) {
    var fileId = req.params.fileId;
    var fatherId = req.body.fatherId;
    var deletePath;
    publicDataBaseService.getById(fileId).then(function (dbfile) {
        var name = dbfile.dataValues.originalName;
        deletePath = JSON.parse(dbfile.dataValues.originalNames).join('/');
        deletePath = path.join(__dirname, '../../publicFileExplorers/' + deletePath);
        publicDataBaseService.getById(fatherId).then(function (dbfolder) {
            if(dbfolder === null) {
                publicDataBaseService.deleteByIndex(dbfile.dataValues.index).then(function () {
                    deleteFolderRecursive(deletePath);
                    res.json({ok: true});
                });
            }else{
                var countChange = parseInt(dbfolder.dataValues.fileCount) - 1;
                if (!dbfile.dataValues.isFolder) {
                    var attachmentName = JSON.parse(dbfile.dataValues.attachmentName);
                    publicDataBaseService.deleteById(fileId).then(function () {
                        var change = {
                            fileCount: countChange
                        };
                        attachmentName.forEach(function(attachment){
                            deletePath = deletePath.replace(name,attachment);
                            if (fs.existsSync(deletePath)) {
                                fs.unlink(deletePath);
                            }
                        });
                        publicDataBaseService.updateById(fatherId, change).then(function () {
                            res.json({ok: true});
                        });
                    });
                } else {
                    publicDataBaseService.deleteByIndex(dbfile.dataValues.index).then(function () {
                        var subordinateNodeChange = JSON.parse(dbfolder.dataValues.subordinateNode);
                        for (var i = 0; i < subordinateNodeChange.length; i++) {
                            if (subordinateNodeChange[i] === name) {
                                subordinateNodeChange.splice(i, 1);
                                break;
                            }
                        }
                        var change = {
                            fileCount: countChange,
                            subordinateNode: JSON.stringify(subordinateNodeChange)
                        };
                        deleteFolderRecursive(deletePath);
                        publicDataBaseService.updateById(fatherId, change).then(function () {
                            res.json({ok: true});
                        });
                    });
                }
            }
        });
    }).catch(function (error) {
        next(error);
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
 * @api {delete} /api/publicDataBase/deleteAttachment 删除附件
 * @apiName DeleteAttachment
 * @apiGroup publicDataBase
 * @apiPermission all
 *
 * @apiParam {String} path 文件路径
 *
 * @apiSuccess {Boolean} ok 删除操作是否成功
 *
 */
router.delete('/deleteAttachment/', function (req, res, next) {
    var filePath = req.body.filePath;
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath);
    }
    res.json(true);
});

/**
 * @api {get} /api/publicDataBase/allNodes 获取文件列表
 * @apiName GetFileList
 * @apiGroup publicDataBase
 * @apiPermission all
 *
 * @apiSuccess {Array} list 文件数组
 *
 */
router.get('/allNodes',function (req, res, next){
    publicDataBaseService.getAllNodes(true).then(function (list) {
        res.result = {ok: true, desc: '查询列表'};
        res.json(list);
    }).catch(function(err){
        next(err);
    });
});
/**
 * @api {get} /api/publicDataBase/father/:fatherId 查询文件信息
 * @apiName GetFile
 * @apiGroup publicDataBase
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
    publicDataBaseService.getByFatherId(fatherId,order).then(function(files){
        if(fatherId !== 'root'){
            publicDataBaseService.getById(fatherId).then(function(dbFile){
                res.json({childNodes : files,indexKey : dbFile.dataValues.indexKey});
            });
            return;
        }
        res.json({childNodes : files});
    }).catch(function(error){
        next(error);
    });
});
/**
 * @api {get} /api/publicDataBase/fileCount/:fatherId 查询文件个数
 * @apiName GetFileCount
 * @apiGroup publicDataBase
 * @apiPermission all
 *
 * @apiParam {String} fatherId 文件Id
 *
 */
router.get('/fileCount/:fatherId',function (req, res, next) {
    var fatherId = req.params.fatherId;
    publicDataBaseService.getPageCountByFatherId(fatherId).then(function(count){
        res.json(count);
    }).catch(function(error){
        next(error);
    });
});
/**
 * @api {post} /api/publicDataBase/newFolder 添加目录
 * @apiName newFolder
 * @apiGroup publicDataBase
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
    var creatorId = req.body.creatorId;
    var indexKey = req.body.indexKey;
    var imgPath = req.body.imgPath;
    var subordinateNode = [];
    var folderPath;
    publicDataBaseService.getById(fatherId).then(function(dbfile){
        if(dbfile===null){
            var parentNameArray=[];
            folderPath = path.join(__dirname, '../../publicFileExplorers/'+'/'+folderName);
            publicDataBaseService.queryFolderSon(fatherId).then(function(files){
                var flag = true;
                for (var i = 0; i < files.length; i++) {
                    if (files[i].dataValues.originalName === folderName) {
                        flag = false;
                        break;
                    }
                }
                if(flag) {
                    if (files.length !== 0) {
                        var index = getIndex(files);
                    } else {
                        index = 1;
                    }
                    parentNameArray.push(folderName);
                    var dbFile = {
                        parentId: fatherId,
                        isFolder: true,
                        originalName: folderName,
                        originalNames: JSON.stringify(parentNameArray),
                        subordinateNode: JSON.stringify(subordinateNode),
                        index: index + ',',
                        indexKey: indexKey,
                        fileCount: 0,
                        imgPath: imgPath,
                        creatorId: creatorId
                    };
                    publicDataBaseService.create(dbFile).then(function (fl) {
                        if (!fs.existsSync(folderPath)) {
                            fs.mkdirSync(folderPath);
                        }
                        res.json({ok: true, info: fl.dataValues});
                    });
                }else{
                    res.json({ok: false, info: "该节点已经存在！"});
                }
            });
        }else{
            publicDataBaseService.queryFolderSon(fatherId).then(function(files){
                var flag = true;
                for (var i = 0; i < files.length; i++) {
                    if (files[i].dataValues.originalName === folderName) {
                        flag = false;
                        break;
                    }
                }
                if(flag) {
                    var index=dbfile.dataValues.index;
                    var parentNames = JSON.parse(dbfile.dataValues.originalNames);
                    parentNames.push(folderName);
                    folderPath = parentNames.join('/');
                    folderPath = path.join(__dirname, '../../publicFileExplorers/'+folderPath);
                    if(files.length !== 0){
                        var count = getIndex(files);
                    }else {
                        count = 1;
                    }
                    index=index+count+',';
                    if(indexKey === '{}'){
                        indexKey = dbfile.dataValues.indexKey;
                    }
                    var dbFile={
                        parentId: fatherId,
                        isFolder: true,
                        originalName: folderName,
                        originalNames: JSON.stringify(parentNames),
                        superiorNode: dbfile.dataValues.originalName,
                        subordinateNode: JSON.stringify(subordinateNode),
                        index: index,
                        indexKey: indexKey,
                        fileCount: 0,
                        imgPath: imgPath,
                        creatorId: creatorId
                    };
                    var countChange = parseInt(dbfile.dataValues.fileCount)+1;
                    var subordinateNodeChange = JSON.parse(dbfile.dataValues.subordinateNode);
                    subordinateNodeChange.push(folderName);
                    var change = {
                        fileCount : countChange,
                        subordinateNode : JSON.stringify(subordinateNodeChange)
                    };
                    publicDataBaseService.create(dbFile).then(function(fl){
                        if (!fs.existsSync(folderPath)) {
                            fs.mkdirSync(folderPath);
                        }
                        publicDataBaseService.updateById(fatherId,change).then(function(){
                            res.json({ok: true, info:fl.dataValues});
                        });
                    });
                }else{
                    res.json({ok: false, info: "该节点已经存在！"});
                }
            });
        }
    }).catch(function(err){
        next(err);
    });
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
 * @api {post} /api/publicDataBase/newFile 添加文件
 * @apiName newFile
 * @apiGroup publicDataBase
 * @apiPermission all
 *
 * @apiParam {String}  name 文件名称

 *
 * @apiSuccess {String} originalName 上传文件原文件名
 * @apiSuccess {String} filename 上传后的文件名
 * @apiSuccess {String} path 上传后的文件相对路径
 * @apiSuccess {String} ext 文件后缀名
 * @apiSuccess {String} size 文件大小
 * @apiSuccess {String} creatorId 上传作者
 * @apiSuccess {Date} time 上传时间
 *
 */
router.post('/newFile',function (req, res, next) {
    var fileName = req.body.name;
    var fatherId = req.body.fatherId;
    var creatorId = req.body.creatorId;
    var indexKey = req.body.indexKey;
    var imgPath = req.body.imgPath;
    var title = req.body.title;
    var subordinateNode = req.body.subordinateNode;
    var attachmentName = req.body.attachmentName;
    var folderPath;
    publicDataBaseService.getById(fatherId).then(function(dbfile){
        publicDataBaseService.queryFolderSon(fatherId).then(function(files){
            var flag = true;
            for (var i = 0; i < files.length; i++) {
                if (files[i].dataValues.originalName === fileName) {
                    flag = false;
                    break;
                }
            }
            if(flag) {
                var index=dbfile.dataValues.index;
                var parentNames = JSON.parse(dbfile.dataValues.originalNames);
                parentNames.push(fileName);
                folderPath = parentNames.join('/');
                folderPath = path.join(__dirname, '../../publicFileExplorers/'+folderPath);
                if(files.length !== 0){
                    var count = getIndex(files);
                }else {
                    count = 1;
                }
                index=index+count+',';
                if(indexKey === '{}'){
                    indexKey = dbfile.dataValues.indexKey;
                }
                var dbFile={
                    parentId: fatherId,
                    isFolder: false,
                    originalName: fileName,
                    originalNames: JSON.stringify(parentNames),
                    superiorNode: dbfile.dataValues.originalName,
                    subordinateNode: subordinateNode,
                    attachmentName: attachmentName,
                    title : title,
                    index: index,
                    indexKey: indexKey,
                    fileCount: 0,
                    imgPath: imgPath,
                    creatorId: creatorId
                };
                var countChange = parseInt(dbfile.dataValues.fileCount)+1;
                /*var subordinateNodeChange = JSON.parse(dbfile.dataValues.subordinateNode);
                subordinateNodeChange.push(fileName);*/
                var change = {
                    fileCount : countChange/*,
                    subordinateNode : JSON.stringify(subordinateNodeChange)*/
                };
                publicDataBaseService.create(dbFile).then(function(fl){
                    /*if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath);
                    }*/
                    publicDataBaseService.updateById(fatherId,change).then(function(){
                        res.json({ok: true, info:fl.dataValues});
                    });
                });
            }else{
                res.json({ok: false, info: "该文件已经存在！"});
            }
        });
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {post} /api/publicDataBase/update 修改文件文件夹信息接口
 * @apiName update
 * @apiGroup publicDataBase
 * @apiPermission all
 *
 * @apiParam {String}  name 文件夹或文件名称

 *
 * @apiSuccess {Boolean} ok 修改操作是否成功
 *
 */

router.post('/update',function (req, res, next) {
    var folderName = req.body.name;
    var oldName = req.body.oldName;
    var nodeId = req.body.nodeId;
    var indexKey = req.body.indexKey;
    var imgPath = req.body.imgPath;
    var title = req.body.title;
    var newRootPath;
    var oldRootPath;
    var originalNames;
    var folderPath;
    var length;
    var fileSelfChange;
    var subordinateNodeChange;
    var change;
    var flag = true;
    publicDataBaseService.getById(nodeId).then(function (dbFile) {
        if(folderName !== oldName){
            folderPath = JSON.parse(dbFile.dataValues.originalNames);
            folderPath.pop();
            folderPath = folderPath.join('/');
            oldName = oldName || dbFile.dataValues.originalName;
            newRootPath = path.join(__dirname, '../../publicFileExplorers/' + folderPath + '/' + folderName);
            oldRootPath = path.join(__dirname, '../../publicFileExplorers/' + folderPath + '/' + oldName);
            publicDataBaseService.queryFolderSon(dbFile.dataValues.parentId, true).then(function (files) {
                for (var i = 0; i < files.length; i++) {
                    if (nodeId !== files[i].dataValues.id && files[i].dataValues.originalName === folderName) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    if (dbFile.dataValues.isFolder) {
                        fileSelfChange = {
                            originalName: folderName,
                            indexKey: indexKey,
                            imgPath: imgPath
                        };
                        publicDataBaseService.updateById(nodeId,fileSelfChange).then(function(nodeInfo){
                            if (fs.existsSync(oldRootPath)) {
                                fs.rename(oldRootPath, newRootPath);
                            }
                            if(dbFile.dataValues.parentId !== 'root'){
                                publicDataBaseService.getById(dbFile.dataValues.parentId).then(function (fatherNode){
                                    var subordinateNode = fatherNode.dataValues.subordinateNode.replace(oldName, folderName);
                                    subordinateNodeChange = {
                                        subordinateNode: subordinateNode
                                    };
                                    publicDataBaseService.updateById(fatherNode.dataValues.id, subordinateNodeChange).then(function () {
                                        length = dbFile.dataValues.index.split(',').length - 2;
                                        publicDataBaseService.queryFolderFilesByFather(dbFile).then(function (folderFiles){
                                            folderFiles.forEach(function (folderFile) {
                                                originalNames = JSON.parse(folderFile.dataValues.originalNames);
                                                originalNames.splice(length, 1, folderName);
                                                if (folderFile.dataValues.parentId !== nodeId) {
                                                    change = {
                                                        originalNames: JSON.stringify(originalNames)
                                                    };
                                                } else {
                                                    change = {
                                                        originalNames: JSON.stringify(originalNames),
                                                        superiorNode: folderName
                                                    };
                                                }
                                                publicDataBaseService.updateById(folderFile.dataValues.id, change)
                                            });
                                            res.json(nodeInfo);
                                        });
                                    });

                                });
                            }else{
                                length = dbFile.dataValues.index.split(',').length - 2;
                                publicDataBaseService.queryFolderFilesByFather(dbFile).then(function (folderFiles){
                                    folderFiles.forEach(function (folderFile) {
                                        originalNames = JSON.parse(folderFile.dataValues.originalNames);
                                        originalNames.splice(length, 1, folderName);
                                        if (folderFile.dataValues.parentId !== nodeId) {
                                            change = {
                                                originalNames: JSON.stringify(originalNames)
                                            };
                                        } else {
                                            change = {
                                                originalNames: JSON.stringify(originalNames),
                                                superiorNode: folderName
                                            };
                                        }
                                        publicDataBaseService.updateById(folderFile.dataValues.id, change)
                                    });
                                    res.json(nodeInfo);
                                });
                            }
                        });
                    } else {
                        originalNames = JSON.parse(dbFile.dataValues.originalNames);
                        originalNames.splice(originalNames.length - 1, 1, folderName);
                        fileSelfChange = {
                            originalName: folderName,
                            originalNames: JSON.stringify(originalNames),
                            title: title,
                            indexKey: indexKey,
                            imgPath: imgPath
                        };
                        publicDataBaseService.updateById(nodeId, fileSelfChange).then(function (nodeInfo) {
                            publicDataBaseService.getById(dbFile.dataValues.parentId).then(function (fatherNode){
                                var subordinateNode = fatherNode.dataValues.subordinateNode.replace(oldName,folderName);
                                subordinateNodeChange = {
                                    subordinateNode : subordinateNode
                                };
                                publicDataBaseService.updateById(fatherNode.dataValues.id, subordinateNodeChange).then(function(){
                                    res.json(nodeInfo);
                                });
                            });
                        });
                    }
                } else {
                    res.json({ok: false, info: "该节点已经存在！", name: oldName});
                }
            });
        }else{
            if (dbFile.dataValues.isFolder) {
                change = {
                    indexKey: indexKey,
                    imgPath: imgPath
                };
                publicDataBaseService.updateById(nodeId, change).then(function (nodeInfo) {
                    res.json(nodeInfo);
                });
            } else {
                change = {
                    title: title,
                    indexKey: indexKey,
                    imgPath: imgPath
                };
                publicDataBaseService.updateById(nodeId, change).then(function (nodeInfo) {
                    res.json(nodeInfo);
                });
            }
        }
    }).catch(function (error) {
        next(error)
    });
});
/**
 * @api {get} /api/publicDataBase/searchFile 搜索接口
 * @apiName searchFile
 * @apiGroup publicDataBase
 * @apiPermission all
 *
 * @apiParam {String}  str 关键字

 *
 * @apiSuccess {Boolean} ok 修改操作是否成功
 *
 */
router.get('/searchFile/:fatherId',function(req, res, next){
    var keyword = req.query.keyword;
    var parentId = req.params.fatherId;
    publicDataBaseService.getById(parentId).then(function (dbFile) {
        publicDataBaseService.searchFilesByTitle(dbFile, keyword).then(function (files) {
            res.json({ok: true, info: files});
        });
    }).catch(function (err) {
        next(err);
    });
});