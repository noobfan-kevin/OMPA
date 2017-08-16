/**
 * Created by hk60 on 2016/4/12.
 */
var express = require('express');
var router = module.exports = express.Router();
var assetTypeService = require('../service/assetTypeService');
var roles = require("../core/auth").roles;
var userLog = require('../core/userLog');

router.get('/getTypeList', function (req, res, next) {
    //console.log('数据到服务器了');
    assetTypeService.query({attributes: ['name','id'],
        order:[["createdAt"]]}).then(function (list) {
        res.result = {ok: true, desc: '查询资产类型列表'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });
});

router.post('/newType',function(req,res, next){
    assetTypeService.create(req.body).then(function (dbDm) {
        userLog.log({type:0,typeId:'',projectId:'123456',description:'添加资产类型:'+req.body.name});
        res.json(dbDm);
    }).catch(function(err){
        next(err);
    });
});

router.delete('/:assetTypeId', function (req, res, next) {
    var id = req.params.assetTypeId;
    var projectId = req.body.projectId;
    new Promise(function(resolve,reject){
        assetTypeService.getById(id).then(function(data){
            resolve(data.name);
        });
    }).then(function(name){
        assetTypeService.deleteById(id).then(function(){
            userLog.log({type:0,typeId:'',projectId:'123456',description:'删除资产类型:'+name});
            res.json({ok:true});
        }).catch(function(err){
            next(err);
        });
    }).catch(function(errInfo){
        console.log(errInfo);
    });

});
router.put('/:assetTypeId',function (req, res, next) {
    var id = req.params.assetTypeId;
    new Promise(function(resolve,reject){
        assetTypeService.getById(id).then(function(data){
            resolve(data.name);
        });
    }).then(function(name){
        assetTypeService.updateById(id,req.body).then(function(){
            if(name!=req.body.name){
                userLog.log({type:0,typeId:'',projectId:'123456',description:'修改资产类型:'+name+'修改为'+req.body.name});
            }
            res.json({ok:true});
        }).catch(function(err){
            next(err);
        });
    }).catch(function(errInfo){
        console.log(errInfo);
    });

});