/**
 * Created by wangziwei on 2015/7/28.
 */
var express = require('express');
var router = module.exports = express.Router();
var log = process.core.log;
var InformService = require('../service/informService');
var userService = require('../service/userService');
var fileService = require('../service/fileService');
var io = process.core.io;
var rolesAdmin = [0];
var rolesLeader = [0,1];
var rolesUser = [2,3];

/**
 * @api {post} /api/inform 新建通知
 * @apiName AddInform
 * @apiGroup Inform
 * @apiPermission leader
 *
 * @apiParam {String} title 标题
 * @apiParam {String} contents 内容
 * @apiParam {String} authorId 作者编号
 * @apiParam {String} authorName 作者姓名
 * @apiParam {Date} createTime 创建时间
 * @apiParam {Number} attachmentAmount 附件数量
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.post('/',function(req,res,next){
    req.body.receivers=JSON.parse(req.body.receivers);
    req.body.attachmentId= JSON.parse(req.body.attachmentId);
    InformService.create(req.body).then(function(results){
        io.sockets.emit('newNotice', { "projectId" : req.body.projectId});
        res.send(results);
    }).catch(function(err){
        next(err);
    });

});

/**
 * @api {delete} /api/inform/:informId 删除通知
 * @apiName DeleteInform
 * @apiGroup Inform
 * @apiPermission leader
 *
 * @apiParam {String} informId 通知编号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.delete('/:informId',function(req,res,next){
    var informId = req.params.informId;
    InformService.deleteById(informId).then(function(results){
        res.result = {ok: true, target: informId, desc: "删除通知"};
        res.json({ok:true});
    }).catch(function(err){
        next(err);
    });

});

/**
 * @api {put} /api/inform/read/:informId 修改通知阅读状态
 * @apiName UpdateInform
 * @apiGroup Inform
 * @apiPermission leader
 *
 * @apiParam {String} userId 接收人Id
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.put('/read/:informId',function(req,res,next){

    var informId = req.params.informId;
    InformService.updateReadStatus(informId,req.body.userId).then(function(){
        res.result = {ok: true,target: informId, desc: "修改通知"};
        res.json({ok:true});
    }).catch((err) => next(err));

});

/**
 * @api {put} /api/inform/:informId 修改通知
 * @apiName UpdateInform
 * @apiGroup Inform
 * @apiPermission leader
 *
 * @apiParam {String} informId 通知编号
 * @apiParam {String} title 标题
 * @apiParam {String} contents 内容
 * @apiParam {Number} attachmentAmount 附件数量
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.put('/:informId',function(req,res,next){

    var informId = req.params.informId;
    InformService.updateById(informId,req.body).then(function(){
        res.result = {ok: true,target: informId, desc: "修改通知"};
        res.json({ok:true});
    }).catch((err) => next(err));

});

/**
 * @api {get} /api/inform/count 查询通知数
 * @apiName GetInformCount
 * @apiGroup Inform
 * @apiPermission all
 *
 * @apiParam {Object} [conditions = {}] 查询条件
 *
 * @apiSuccess {Number} count 符合条件的通知数
 *
 */
router.get('/count', function (req, res, next) {

    InformService.informCount(req.query.conditions || {}).then(function (count) {
        res.json({ok: true, count:count})
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/inform/:informId 取得通知信息
 * @apiName GetInform
 * @apiGroup Inform
 * @apiPermission all
 *
 * @apiParam {String} informId 通知编号
 *
 * @apiSuccess {String} title 标题
 * @apiSuccess {String} contents 内容
 * @apiSuccess {String} authorId 创建人编号
 * @apiSuccess {String} authorName 创建人姓名
 * @apiSuccess {Number} attachmentAmount 附件数量
 * @apiSuccess {Date} createTime 创建时间
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Array} list 结果数组·
 */
router.get('/:informId',function(req,res,next){
    var informId = req.params.informId;
    InformService.getById(informId).then(function (results) {

        userService.getById(results.senderId).then(function(result2){
            res.result = {ok: true,target: informId, desc: "获取群信息"};
            results.dataValues.username=result2.dataValues.name;
            res.json({ok: true, list:results});
        }).catch(function(err2){
            next(err2);
        });

    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/inform 查询通知列表
 * @apiName GetInformList
 * @apiGroup Inform
 * @apiPermission all
 *
 * @apiParam {Object} [where={}] 查询条件
 * @apiParam {String} [fields=""] 查询字段
 * @apiParam {Object} [options={}] 查询选项，分页、排序
 *
 * @apiParamExample {json} 分页请求通知title字段:
 *      conditions = {} &
 *      fields = "title" &
 *      options = {skip: 10,limit: 5}
 *
 * @apiSuccess {Array} list 通知数组
 *
 */
router.get('/', function (req, res, next) {
    if(typeof req.query.where == 'string')
    req.query.where = JSON.parse(req.query.where);
    InformService.query(req.query).then(function (list) {
        res.result = {ok: true, desc: '查询列表'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });

});

