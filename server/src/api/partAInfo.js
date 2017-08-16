/**
 * Created by hk60 on 2016/6/2.
 */
var express = require('express');
var router = module.exports = express.Router();
var partAInfoService = require('../service/partAInfoService');
var roles = require("../core/auth").roles;
var userLog = require('../core/userLog');

router.get('/getPartAInfo', function (req, res, next) {
    //console.log('数据到服务器了');
    partAInfoService.query().then(function (list) {
        res.json(list);
    }).catch(function(err){
        next(err);
    });
});

router.put('/:Id',function (req, res, next) {
    var id = req.params.Id;
    var changeInfo = '甲方信息：';
    new Promise(function(resolve,reject){
        partAInfoService.getById(id).then(function(data){
            var re = req.body;
            if(data.name!=re.name){
                changeInfo+='甲方名称：'+data.name+'修改为'+re.name+'\r\n';
            }
            if(data.phone!=re.phone){
                changeInfo+='甲方电话：'+data.phone+'修改为'+re.phone+'\r\n';
            }
            if(data.email!=re.email){
                changeInfo+='甲方邮箱：'+data.email+'修改为'+re.email+'\r\n';
            }
            if(data.location!=re.location){
                changeInfo+='甲方地址：'+data.location+'修改为'+re.location+'\r\n';
            }
            resolve(changeInfo);
        })
    }).then(function(info){
        partAInfoService.updateById(id,req.body).then(function(){
            userLog.log({type:0,typeId:'',projectId:'123456',description:'修改甲方信息:'+info});
        }).catch(function(err){
            next(err);
        });
    }).catch(function(err){
        console.log(err);
    });

});