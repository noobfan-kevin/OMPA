/**
 * Created by hk61 on 2016/7/13.
 */
var express = require('express');
var router = module.exports = express.Router();
var StepInfo = process.core.db.models.StepInfo;

var statisticsService = require('../service/statisticsService');


/*
*  新建
* */
router.post('/', function(req, res, next) {
    statisticsService.create(req.body).then(function(list){
        res.json({ok:true, data: list[0],  message:'创建统计成功！'});
    }).catch(function(err){
        next(err);
    });
});



/*
 *  删除
 * */
router.delete('/:statsId', function(req, res, next) {
    var id = req.params.statsId;
    statisticsService.deleteById(id).then(function(result){
        res.json({ok:true, data: result, message:'删除统计成功！'});
    }).catch(function(err){
        next(err);
    });
});



/*
 *  修改
 * */
router.put('/:statsId', function(req, res, next) {
    var id = req.params.statsId;
    statisticsService.update(id, req.body).then(function(list){
        res.json({ok:true, data: list[0], message:'修改统计成功！'});
    }).catch(function(err){
        next(err);
    });
});



/*
 *  根据项目id获取
 * */
router.get('/getByProjectId/:projectId', function(req, res, next) {
    var projectId = req.params.projectId;
    statisticsService.getByProjectId(projectId).then(function(result){
        res.json({ok:true, data: result, message:'获取成功！'});
    }).catch(function(err){
        next(err);
    });
});



/*
 *  根据id获取所有节点
 * */
router.get('/nodes/:statsId', function(req, res, next) {
    var id = req.params.statsId;
    statisticsService.getNodesById(id).then(function(result){
        res.json({ok:true, data: result, message:'获取成功！'});
    }).catch(function(err){
        next(err);
    });
});


/*
 *  根据项目id获取所有节点
 * */
router.get('/getNodesByProjectId/:projectId', function(req, res, next) {
    var projectId = req.params.projectId;
    return StepInfo.all({
        where: { projectId: projectId },
        attributes: ['id','name', 'projectId', 'fatherId'],
        order: [['lft', 'DESC']]
    }).then(function(dbSteps) {
        return res.json({ok: true, list:dbSteps});
    }).catch(function(err){
        next(err);
    });
});



/*
 *  根据项目id获取列表（简单结构）
 * */
router.get('/list/:projectId', function(req, res, next) {
    var projectId = req.params.projectId;
    statisticsService.getList(projectId).then(function(result){
        res.json({ok:true, list: result, message:'获取列表成功！'});
    }).catch(function(err){
        next(err);
    });
});


/*
 *  获取单个统计详细
 * */
router.get('/detail/:statsId', function(req, res, next) {
    var statsId = req.params.statsId;
    statisticsService.getDetailById(statsId).then(function(result){
        res.json({ok:true, data: result, message:'获取详情成功！'});
    }).catch(function(err){
        next(err);
    });
});


/*
 *  获取默认统计（根据项目id）
 * */
router.get('/default/:projectId', function(req, res, next) {
    var projectId = req.params.projectId;
    statisticsService.getDefault(projectId).then(function(result){
        res.json({ok:true, data: result, message:'获取默认统计成功！'});
    }).catch(function(err){
        next(err);
    });
});