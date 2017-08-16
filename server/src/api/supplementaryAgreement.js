/**
 * Created by hk60 on 2016/6/12.
 */
var express = require('express');
var router = module.exports = express.Router();
var SAgreementService = require('../service/SAgreementService');
var roles = require("../core/auth").roles;

/*
 * 获取
 * @Param {String} id 补充协议id
 * */
router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    SAgreementService.getAgreement(id).then(function(db){
        res.json(db);
    }).catch(function(err){
        next(err);
    });
});


/*
 * 创建
 * */
router.post('/',function(req,res, next){
    SAgreementService.create(req.body).then(function (db) {
        res.json(db);
    }).catch(function(err){
        next(err);
    });
});


/*
* 删除
* @Param {String} id 补充协议id
* */
router.delete('/:id',function(req,res, next){
    var id = req.params.id;
    SAgreementService.create(id).then(function (result) {
        res.json(result);
    }).catch(function(err){
        next(err);
    });
});

/*
* 获取列表
* @Param {String} contractId 合同id
* */
router.get('/all/:contractId', function (req, res, next) {
    var contractId = req.params.contractId;
    SAgreementService.allByContractId(contractId).then(function(results) {
        res.json(results);
    }).catch(function(err){
        next(err);
    })
});