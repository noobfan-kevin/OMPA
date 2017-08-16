/**
 * Created by HeLiang on 2016/6/13.
 */
var express = require('express');
var router = module.exports = express.Router();
var fundDataBaseService = require('../service/fundDataBaseService');
var config=require('../config.js');//config
var fs = require('fs');
var path = require('path');
var utils = require('../core/utils');
var async = require('async');

/**
 * @api {get} /api/fundDataBase 获取文件列表
 * @apiName GetFileList
 * @apiGroup fundDataBase
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
    fundDataBaseService.getFundByProjectId(projectId).then(function (list) {
        res.result = {ok: true, desc: '查询列表'};
        res.json(list);
    }).catch(function(err){
        next(err);
    });
});
router.get('/projectPay/:projectId', function (req, res, next) {

    var projectId = req.params.projectId;
    fundDataBaseService.getPayByProjectId(projectId).then(function (list) {
        res.result = {ok: true, desc: '查询列表'};
        res.json(list);
    }).catch(function(err){
        next(err);
    });
});
/**
 * @api {get} /api/fundDataBase/index 获取文件列表
 * @apiName GetFileList
 * @apiGroup fundDataBase
 * @apiPermission all
 *
 *
 * @apiParam {String} Id 文件Id
 *
 *
 *
 * @apiSuccess {Array} list 文件数组
 *
 */
/*router.get('/index/:id', function (req, res, next) {
 var id = req.params.id;
 fundDataBaseService.getById(id).then(function (folder) {
 fundDataBaseService.queryFoldersByFather(folder).then(function (list) {
 res.result = {ok: true, desc: '查询列表'};
 res.json(list);
 });
 }).catch(function(err){
 next(err);
 });
 });*/
/**
 * @api {get} /api/fundDataBase/:fileId 查询文件信息
 * @apiName GetFile
 * @apiGroup fundDataBase
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
router.get('/:fundId',function (req, res, next) {
    var fundId = req.params.fundId;
    fundDataBaseService.getById(fundId).then(function (dbFile) {
        ////console.log(dbFile);
        res.json(dbFile);
    }).catch(function(err){
        next(err);
    });
    /*
     fundDataBaseService.getById(fileId, function (err, dbFile) {
     if (err) {
     next(err);
     } else {
     res.json(dbFile);
     }
     });
     */
});

/**
 * @api {delete} /api/fundDataBase/:fileId 删除文件
 * @apiName DeleteFile
 * @apiGroup fundDataBase
 * @apiPermission all
 *
 * @apiParam {String} fileId 文件Id
 *
 * @apiSuccess {Boolean} ok 删除操作是否成功
 *
 */
router.delete('/:id', function (req, res, next) {
    var id = req.params.id;
    fundDataBaseService.deleteById(id).then(function (result) {
        res.json({ok: true, desc: '删除成功！'})
    }).catch(function(err){
        next(err);
    });

});

/**
 * @api {get} /api/fundDataBase/father/:fatherId 查询文件信息
 * @apiName GetFile
 * @apiGroup fundDataBase
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
    fundDataBaseService.getByFatherId(fatherId,order).then(function(files){
        res.json(files);
    }).catch(function(error){
        next(error);
    });
    /*fundDataBaseService.getByFatherId(fatherId, function (err, dbFile) {
     if (err) {
     next(err);
     } else {
     //console.log(dbFile);
     res.json(dbFile);
     }
     });*/
});

router.post('/getFileChild/',function (req, res, next) {
    //console.log("========365===========");
    //console.log(req.body);
    var fatherId = req.body.node;
    if(fatherId.indexOf("folderId_")>=0)
    {
        fatherId=fatherId.replace("folderId_","");
    }

    var order="ASC";
    fundDataBaseService.getByFatherId(fatherId,order).then(function(files) {
        var result = [];
        for (var i = 0; i < files.length; i++) {
            if(files[i].dataValues.isFolder){
                result.push(files[i].dataValues);
            }
        }
        //console.log(result);
        fundDataBaseService.arrangeFolderTree(result).then(function(result2){
            //console.log(result2);
            //res.json(files);
            var filearray=[];
            for(var i=0;i<result2.length;i++){
                //{"text":"air","id":"\/air","cls":"folder","leaf":false}
                /*
                 treeNode.put("allowAppend", true);
                 treeNode.put("leaf", true);
                 treeNode.put("allowDelete", true);
                 treeNode.put("allowModify", true);
                 * */
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
    /*fundDataBaseService.getByFatherId(fatherId, function (err, dbFile) {
     if (err) {
     next(err);
     } else {
     //console.log(dbFile);
     res.json(dbFile);
     }
     });*/
});
/**
 * @api {get} /api/fundDataBase/folderAll/:fatherId 查询文件信息
 * @apiName GetFile
 * @apiGroup fundDataBase
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
router.get('/folderAll/:fatherId',function (req, res, next) {
    var fatherId = req.params.fatherId;
    var father={
        _id:fatherId,
        isFolder:true
    };
    fundDataBaseService.queryFoldersByFather(father, function (err, dbFile) {
        if (err) {
            next(err);
        } else {
            //console.log(dbFile);
            res.json(dbFile);
        }
    });

});

/**
 * @api {get} /api/fundDataBase/group/:groupId 查询群文件
 * @apiName GetGroupFile
 * @apiGroup fundDataBase
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
router.get('/group/:groupId',function (req, res, next) {
    var groupId = req.params.groupId;
    fundDataBaseService.findGroupFile(groupId).then(function (dbFile) {

        res.json(dbFile);

    }).catch(function(err){ next(err)});
});

/**
 * @api {post} /api/fundDataBase/newFund 添加目录
 * @apiName newFolder
 * @apiGroup fundDataBase
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
router.post('/newFund',function (req, res, next) {
    var folderName = req.body.name;
    var fatherId = req.body.fatherId;
    var amount = req.body.amount;
    var projectId = req.body.projectId;
    if(fatherId !== 'root'){
        fundDataBaseService.getById(fatherId).then(function(dbfile){
            fundDataBaseService.queryFolderSon(fatherId).then(function(files){
                /*if(files.length !== 0){
                    var count = getIndex(files);
                }else {
                    count = 1;
                }
                var index=index+count+',';*/

                var dbFile={
                    parentId:fatherId,
                    amount:amount,
                    name:folderName,
                    //index:index,
                    projectId:projectId,
                    isFund:true
                };
                if(dbFile.parentId == 'undefined'){
                    delete dbFile.parentId;
                }
                fundDataBaseService.create(dbFile).then(function(fl){
                    res.json({ok: true, info:fl.dataValues});
                });
            });
        }).catch(function(err){
            next(err);
        });
        return;
    }
    //项目根目录不存入数据库
    var dbFile={
        id : projectId,
        parentId:fatherId,
        amount:amount,
        name:folderName,
        //index:index,
        projectId:projectId,
        isFund:true
    };
    fundDataBaseService.create(dbFile);
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
 * @api {post} /api/fundDataBase/update 修改文件文件夹信息接口
 * @apiName update
 * @apiGroup fundDataBase
 * @apiPermission all
 *
 * @apiParam {String}  name 文件夹或文件名称

 *
 * @apiSuccess {Boolean} ok 修改操作是否成功
 *
 */

router.post('/update',function (req, res, next) {
    var fundName = req.body.name;
    var amount = req.body.amount;
    var fundId = req.body.fundId;
    var change;
    console.log(typeof amount);
    if(amount!=='undefined'){
        change = {
            name : fundName,
            amount : amount
        };
    }else {
        change = {
            name : fundName
        };
    }
    fundDataBaseService.updateById(fundId, change).then(function(dbFile){
        res.json({ok: true,result:dbFile});
    }).catch(function (error) {
        next(error)
    });
});
router.post('/newPay',function (req, res, next) {
    var type = req.body.type;
    var username = req.body.username;
    var money = req.body.money;
    var remark = req.body.remark;


                /*if(files.length !== 0){
                 var count = getIndex(files);
                 }else {
                 count = 1;
                 }
                 var index=index+count+',';*/
                var dbFile = {
                    parentId: type,
                    name: username,
                    amount: money,
                    remark: remark,
                    isFund:false
                };
                fundDataBaseService.create(dbFile).then(function (fl) {
                    res.json({ok: true, info: fl.dataValues});
                }).catch(function (err) {
                    next(err);
                });

});