/**
 * Created by HK059 on 2016/6/1.
 */
var express = require('express');
var router = module.exports = express.Router();
var fileTypeService = require('../service/fileTypeService');

router.get('/getTypeList', function (req, res, next) {
    fileTypeService.query({attributes: ['name','id'],
        order:[["createdAt"]]}).then(function (list) {
        res.result = {ok: true, desc: '查询文件类型列表'};
        res.json(list);
    }).catch(function(err){
        next(err);
    });
});

router.post('/newType',function(req,res, next){
    fileTypeService.create(req.body).then(function (dbDm) {
        res.result = {ok: true, target: dbDm._id, desc: '添加文件类型'};  //记录日志
        res.json(dbDm);
    }).catch(function(err){
        next(err);
    });
});

router.delete('/:fileTypeId', function (req, res, next) {
    var id = req.params.fileTypeId;
    fileTypeService.deleteById(id).then(function(){
        res.result = {ok: true, desc: '删除类型'};
        res.json({ok:true});
    }).catch(function(err){
        next(err);
    });
});
router.put('/:fileTypeId',function (req, res, next) {
    var id = req.params.fileTypeId;
    fileTypeService.updateById(id,req.body).then(function(fileType){
        res.result = {ok: true, target: req.body, desc: '更新类型'};
        res.json(fileType);
    }).catch(function(err){
        next(err);
    });
});