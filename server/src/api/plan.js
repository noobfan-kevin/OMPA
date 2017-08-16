/**
 * Created by wangziwei on 2015/9/15.
 */
var express = require('express');
var router = module.exports = express.Router();
var log = process.core.log;
var schemaService = require('../service/planService');
var userLog = require('../core/userLog');

var roles = require('../core/auth').roles;

var rolesAdmin = [0];
var rolesLeader = [0,1];
var rolesUser = [2,3];

/**
 * @api {post} /api/plan 新建方案
 * @apiName AddSchema
 * @apiGroup Schema
 * @apiPermission leader
 *
 * @apiParam {String} content 内容
 * @apiParam {String} taskVersion 任务卡版本号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.post('/',function(req,res,next){
    schemaService.create(req.body, function(err,results){
        if(err){
            next(err);
        }
        else{
            userLog.log({type: 1,typeId:'',projectId: req.body.taskVersionId, description: '添加了方案'});
            res.result = {ok: true, target: results._id, desc: "新建方案"};
            res.json({ok:true, target: results._id});
        }
    });
});

/**
 * @api {post} /api/plan/save 保存方案
 * @apiName SaveSchema
 * @apiGroup Schema
 * @apiPermission leader
 *
 * @apiParam {String} content 内容
 * @apiParam {String} taskVersion 任务卡版本号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.post('/save',  function(req,res,next){
    schemaService.updateAndCreate(req.body).then(function(results){
        if(req.body.taskVersionId){
            userLog.log({type: 1,typeId: req.body.taskVersionId,projectId: req.body.taskVersionId, description: '修改了方案'});
        }else{
            userLog.log({type: 1,typeId:'',projectId: req.body.taskVersionId, description: '添加了方案'});
        }
        res.result = {ok: true, target: results.id, desc:"保存方案"};
        res.json({ok:true, target: results.id});
    }).catch(function(err){
        next(err);
    });
});



/**
 * @api {delete} /api/plan/:schemaId 删除方案
 * @apiName DeleteSchema
 * @apiGroup Schema
 * @apiPermission leader
 *
 * @apiParam {String} schemaId 方案编号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.delete('/:schemaId',function(req,res,next){
    var schemaId = req.params.schemaId;
    schemaService.deleteById(schemaId,function(err,results){
        if(err){
            next(err);
        }
        else{
            userLog.log({type: 1,typeId: req.body.taskVersionId,projectId: req.body.taskVersionId, description: '删除了方案'});
            res.result = {ok: true, target: schemaId, desc: "删除方案"};
            res.json({ok:true});
        }
    });
});

/**
 * @api {put} /api/plan/:schemaId 修改方案
 * @apiName UpdateSchema
 * @apiGroup Schema
 * @apiPermission leader
 *
 * @apiParam {String} schemaId 通知编号
 * @apiParam {String} content 内容
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.put('/:schemaId',function(req,res,next){
    var schemaId = req.params.schemaId;

    schemaService.updateById(schemaId, req.body).then(function(results) {
        res.result = {ok: true,target: schemaId, desc: "修改方案"};
        res.json({ok:true});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/plan/:taskVersion 获取当前任务卡版本方案
 * @apiName GetCurrentSchema
 * @apiGroup Schema
 * @apiPermission leader
 *
 * @apiParam {String} taskVersion 任务卡版本编号
 *
 * @apiSuccess {String} _id 主键ID
 * @apiSuccess {String} content 内容
 * @apiSuccess {String} taskVersion 任务卡版本编号
 *
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.get('/:taskVersion',function(req,res,next){
    var taskVersion = req.params.taskVersion;

    schemaService.getByTaskVersionId(taskVersion).then(function(result) {
        res.result = {ok: true,target: taskVersion, desc: "获取任务卡当前版本所属方案"};
        res.json({ok:true,list:result});
    }).catch(function(err){
        next(err);
    });
});

// 删除方案冗余图片
router.post('/delRubbishFiles',function(req,res,next){
    var schemaId = req.body.schemaId;
    var remainFiles = JSON.parse(req.body.remainFiles);

    schemaService.deleteRubbishFiles(schemaId, remainFiles).then(function(result) {
        res.result = {ok: true,list: result, desc: "删除方案垃圾文件"};
        res.json({ok:true,list:result});
    }).catch(function(err){
        next(err);
    });
});

