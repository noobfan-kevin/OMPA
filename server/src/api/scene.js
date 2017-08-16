/**
 * Created by hk60 on 2016/4/21.
 * 镜头API
 */
var express = require('express');
var router = module.exports = express.Router();
var sceneService = require('../service/sceneService');
var roles = require("../core/auth").roles;
var userLog = require('../core/userLog');

router.post('/new',function(req,res, next){
    sceneService.create(req.body).then(function (data) {
        userLog.log({type:0,typeId:'',projectId:req.body.projectId,description:'新建镜头:'+req.body.name});
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});

router.get('/getList/:jiId', function (req, res, next) {
    var jiId = req.params.jiId;
    sceneService.query(jiId,req.query.offset).then(function (list) {
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });
});

router.get('/count', function (req, res, next) {
    sceneService.assetTotal(req.query.jiId).then(function (count) {
        res.json({ok: true, count:count.count})
    }).catch(function(err){
        next(err);
    });
});

router.get('/shot/:sceneId', function (req, res, next) {
    var sceneId = req.params.sceneId;
    sceneService.getShotById(sceneId).then(function (data) {
        res.json({ok: true, data:data})
    }).catch(function(err){
        next(err);
    });
});

router.put('/Update/:sceneId',function (req, res, next) {
    var id = req.params.sceneId;
    var re = req.body;
    var changeInfo = '镜头修改：';
    new Promise(function(resolve,reject){
        sceneService.getShotById(id).then(function(data){
            resolve(data);
        })
    }).then(function(info){
        //console.log(re,'info111111111111111');
        sceneService.updateById(id,req.body).then(function(data){
            if(info.name!=re.name){
                changeInfo+='镜头名称：“'+info.name+'”修改为“'+re.name+'”\r\n';
            }
            if(info.shotCode!=re.shotCode){
                changeInfo+='镜头编码：“'+info.shotCode+'”修改为“'+re.shotCode+'”\r\n';
            }
            if(info.jiId!=re.jiId){
                changeInfo+='镜头所属集：“'+info.ji.name+'”修改为“'+data.ji.name+'”\r\n';
            }
            if(info.changId!=re.changId){
                changeInfo+='镜头所属场：“'+info.chang.name+'”修改为“'+data.chang.name+'”\r\n';
            }
            if(info.desc!=re.desc){
                changeInfo+='镜头描述：“'+info.desc+'”修改为“'+re.desc+'”\r\n';
            }
            if(changeInfo!='镜头修改：'){
                userLog.log({type:0,typeId:'',projectId:info.projectId,description:changeInfo});
            }
            //console.log(data,'info2222222222222222222222');
            res.json(data);
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
        sceneService.getShotById(id).then(function(data){
            var _data = {
                name:data.name,
                projectId:data.projectId
            };
            resolve(_data);
        })
    }).then(function(info){
        sceneService.deleteById(id).then(function(){
            userLog.log({type:0,typeId:'',projectId:info.projectId,description:'删除镜头：'+info.name});
            res.json({ok:true});
        }).catch(function(err){
            next(err);
        });
    }).catch(function(err){
        console.log(err);
    });

});
router.get('/checkUnderNode/:nodeId', function (req, res, next) {
    var nodeId = req.params.nodeId;
    sceneService.getSceneByNodeId(nodeId).then(function (data) {
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});