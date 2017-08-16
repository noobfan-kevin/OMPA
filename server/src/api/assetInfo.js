/**
 * Created by hk60 on 2016/4/13.
 */
var express = require('express');
var router = module.exports = express.Router();
var assetInfoService = require('../service/assetInfoService');
var roles = require("../core/auth").roles;
var userLog = require('../core/userLog');

router.post('/newAsset',function(req,res, next){
    var projectId = req.body.projectId;
    assetInfoService.create(req.body).then(function (dbDm) {
        userLog.log({type:0,typeId:'',projectId:projectId,description:'新建资产:'+req.body.name});
        res.json(dbDm);
    }).catch(function(err){
        next(err);
    });
});

router.get('/getAssetList', function (req, res, next) {
    //console.log('数据到服务器了');
    assetInfoService.query({order:[["createdAt"]]}).then(function (list) {
        res.result = {ok: true, desc: '查询资产列表'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });
});

router.get('/count', function (req, res, next) {
    assetInfoService.assetTotal(req.query.projectId).then(function (count) {
        res.json({ok: true, count:count.count})
    }).catch(function(err){
        next(err);
    });
});

router.get('/assetInfo/:assetId', function (req, res, next) {
        var assetId = req.params.assetId;
    assetInfoService.getAssetById(assetId).then(function (data) {
        res.json({ok: true, data:data})
    }).catch(function(err){
        next(err);
    });
});


router.get('/OnePageAssets',function(req,res,next) {
    assetInfoService.getOnePageAssets(req.query.offset,req.query.projectId).then(function(data){
        res.json({ok:true,data:data})
    }).catch(function(err){
        next(err);
    });
});

router.put('/updateAsset/:assetId',function (req, res, next) {
    var id = req.params.assetId;
    var projectId = req.body.projectId;
    var changeInfo = '修改资产：\r\n';
    new Promise(function(resolve,reject){
        assetInfoService.findAssetById(id).then(function(data){
            //TODO name,type,desc
            resolve(data);
        });
    }).then(function(data){
        assetInfoService.updateById(id,req.body).then(function(){
            //console.log({type:0,typeId:'',projectId:projectId,description:info},'123123');
            assetInfoService.findAssetById(id).then(function(info){
                var reqBody = req.body;
                if(data.name!=reqBody.name){
                    changeInfo+='资产名称："'+data.name+'"修改为"'+reqBody.name+'"\r\n';
                }
                if(data.type!=reqBody.type){
                    changeInfo+='资产类型："'+data.AssetsType.name+'"修改为"'+info.AssetsType.name+'"\r\n';
                }
                if(data.desc!=reqBody.desc){
                    changeInfo+='资产描述："'+data.desc+'"修改为"'+reqBody.desc+'"\r\n';
                }
                if(changeInfo!='修改资产：\r\n'){
                    userLog.log({type:0,typeId:'',projectId:projectId,description:changeInfo});
                }
            });
            res.json({ok:true});
        }).catch(function(err){
            next(err);
        });
    }).catch(function(errinfo){
        console.log(errinfo);
    });
});

router.delete('/deleteAsset/:assetId', function (req, res, next) {
    var id = req.params.assetId;
    var projectId = req.body.projectId;
    new Promise(function(resolve,reject){
        assetInfoService.findAssetById(id).then(function(data){
            resolve(data.name);
        });
    }).then(function(info){
        assetInfoService.deleteById(id).then(function(){
            userLog.log({type:0,typeId:'',projectId:projectId,description:'删除资产:'+info});
            res.json({ok:true});
        }).catch(function(err){
            next(err);
        });
    }).catch(function(errinfo){
        console.log(errinfo);
    });

});

router.get('/checkAsset/:typeId', function (req, res, next) {
    var typeId = req.params.typeId;
    assetInfoService.getAssetsByTypeId(typeId).then(function (data) {
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});