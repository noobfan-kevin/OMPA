/**
 * Created by Administrator on 2015/8/14.
 */
var express = require('express');
var router = module.exports = express.Router();
var log = process.core.log;
var MessageStatusService = require('../service/messageStatusService');
var async = require('async');


/** 
 * @api {get} /api/messageStatus/:receiverId 查询最后聊天记录
 * @apiName GetMassageStatusByreceiverId
 * @apiGroup MassageStatus
 * @apiPermission all
 *
 * @apiParam {String} receiverId 接收编号
 *
 * @apiSuccess {String} sender 发送编号
 * @apiSuccess {String} receiverId 接收编号
 * @apiSuccess {String} type 接收类型
 * @apiSuccess {String} time 窗口关闭时间
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Array} list 结果数组
 */
router.get('/:receiverId',function(req,res,next){
    var receiverId = req.params.receiverId;
    var projectId=req.query.projectId;
    MessageStatusService.queryMessageStatus(receiverId,projectId).then(function (results) {
        res.result = {ok: true, desc: "获取消息状态"};
        res.json({ok: true, list:results});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {put} /api/messageStatus 修改窗口关闭时间
 * @apiName UpdateTimeByMassageStatus
 * @apiGroup MassageStatus
 * @apiPermission all
 *
 * @apiParam {String} sender 发送编号
 * @apiParam {String} receiverId 接收编号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.put('/',function(req,res,next){
    var senders = JSON.parse(req.body.sender);
    var receiverId = req.body.receiverId;
    return MessageStatusService.updateByReceiverId(senders,receiverId).then(function(){
        res.result = {ok: true, desc: "修改窗口关闭时间"};
        res.json({ok: true});
    }).catch(function(err){
        next(err);
    });

});