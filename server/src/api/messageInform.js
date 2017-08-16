/**
 * Created by wangziwei on 2015/10/8.
 */

var express = require('express');
var router = module.exports = express.Router();
var log = process.core.log;
var MessageInformService = require('../service/messageInformService');

var roles = require('../../core/auth').roles;

/**
 * @api {post} /api/messageInform 新建消息通知
 * @apiName AddMessageInform
 * @apiGroup MessageInform
 *
 * @apiParam {Number} type 类型
 * @apiParam {String} contents 内容
 * @apiParam {String} taskVersion 任务卡版本
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.post('/',function(req,res,next){
    MessageInformService.create(req.body, function(err,results){
        if(err){
            next(err);
        }
        else{
            res.result = {ok: true, target: results._id, desc: "新建消息通知"};
            res.json({ok:true});
        }
    });
});