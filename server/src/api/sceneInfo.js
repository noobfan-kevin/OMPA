/**
 * Created by hk60 on 2016/4/18.
 * 镜头下场集树对应的API
 */
var express = require('express');
var router = module.exports = express.Router();
var sceneInfoService = require('../service/sceneInfoService');
var roles = require("../core/auth").roles;
var userLog = require('../core/userLog');

router.post('/new',function(req,res, next){
    sceneInfoService.create(req.body).then(function (dbDm) {
        userLog.log({type:0,typeId:'',projectId:req.body.projectId,description:"新建镜头下场集："+req.body.name});
        res.json(dbDm);
    }).catch(function(err){
        next(err);
    });
});

router.get('/getProjectList/:id', function (req, res, next) {
    var projectId = req.params.id;
    sceneInfoService.query(projectId,{order:[["createdAt"]]}).then(function (list) {
        res.result = {ok: true, desc: '查询资产列表'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });
});

router.get('/getList/:id', function (req, res, next) {
    var fatherId = req.params.id;
    sceneInfoService.getChildren(fatherId,req.query.projectId).then(function (list) {
        res.json(list);
    }).catch(function(err){
        next(err);
    });
});
router.get('/getSuperFatherId', function (req, res, next) {
    //console.log('数据到服务器了');
    sceneInfoService.getSuperFatherId().then(function (list) {
        res.json(list);
    }).catch(function(err){
        next(err);
    });
});

router.get('/sceneTree/:sceneId', function (req, res, next) {
    var sceneId = req.params.sceneId;
    sceneInfoService.getSceneById(sceneId).then(function (data) {
        res.json({ok: true, data:data})
    }).catch(function(err){
        next(err);
    });
});

router.put('/Update/:sceneId',function (req, res, next) {
    var id = req.params.sceneId;
    var re = req.body;
    var changeInfo = '场集树修改：';
    new Promise(function(resolve,reject){
        sceneInfoService.getSceneById(id).then(function(data){
            resolve(data);
        })
    }).then(function(info){
        sceneInfoService.updateById(id,re).then(function(data){
            if(data.name!=re.name){
                changeInfo+='名称修改：'+data.name+'修改为'+re.name+'\r\n';
            }
            if(info.fatherId!=re.fatherId){
                changeInfo+='父节点修改：'+info.father.name+'修改为'+data.father.name+'\r\n';
            }
            if(changeInfo!='场集树修改：'){
                userLog.log({type:0,typeId:'',projectId:info.projectId,description:changeInfo});
            }
            res.json({ok:true});
        }).catch(function(err){
            next(err);
        });
    }).catch(function(err){
        console.log(err);
    });
});

router.delete('/Delete/:sceneId', function (req, res, next) {
    var id = req.params.sceneId;
    new Promise(function(resolve,reject){
        sceneInfoService.getSceneById(id).then(function(data){
            resolve(data);
        })
    }).then(function(info){
        sceneInfoService.deleteById(id).then(function(){
            userLog.log({type:0,typeId:'',projectId:info.projectId,description:'镜头下场集删除：'+info.name});
            res.json({ok:true});
        }).catch(function(err){
            next(err);
        });
    }).catch(function(err){
        console.log(err);
    });
});

