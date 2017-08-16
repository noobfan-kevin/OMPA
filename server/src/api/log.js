/**
 * Created by hk60 on 2016/7/8.
 */
var express = require('express');
var router = module.exports = express.Router();
var logService = require('../service/logService');

router.get('/logList',function(req,res,next){
    logService.getOnePageLogs(req.query).then(function(data){
        res.json(data);
    }).catch(function(err){
        console.log(err);
    });
});

router.get('/count',function(req,res,next){
   logService.getCount(req.query).then(function(data){
       res.json(data);
   }).catch(function(err){
       console.log(err);
   })
});

router.get('/keyWords',function(req,res,next){
    logService.getByKeyWords(req.query.info).then(function(data){
        res.json(data);
    })
});
/*
* 主页获取工作动态
* @param {userId,offset}
* */
router.get('/getDynamics',function(req,res,next){
    logService.getPersonDynamics(req.query).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});