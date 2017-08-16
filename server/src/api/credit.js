/**
 * Created by wangziwei on 2015/7/28.
 */
var express = require('express');
var router = module.exports = express.Router();
var log = process.core.log;
var creditService = require('../service/creditService');



/**
 * @api {get} /api/credit 查询积分明细列表
 * @apiName GetCreditList
 * @apiGroup Credit
 * @apiPermission all
 *
 * @apiParam {String} [where.userId] 用户Id
 * @apiParam {String} [where.projectId] 项目Id
 *
 * @apiSuccess {Array} list 通知数组
 *
 */
router.get('/', function (req, res, next) {
    req.query.where = JSON.parse(req.query.where);
    creditService.query(req.query).then( function (list) {
        res.result = {ok: true, desc: '查询积分表'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/credit/total 查询总积分
 * @apiName GetCreditTotal
 * @apiGroup Credit
 * @apiPermission all
 *
 * @apiParam {String} [where.userId] 用户Id
 * @apiParam {String} [where.projectId] 项目Id
 *
 * @apiSuccess {Number} total 总积分
 *
 */
router.get('/total', function (req, res, next) {
    req.query.where = JSON.parse(req.query.where);
    creditService.countCreditTotal(req.query).then( function (total) {
        res.json({ok: true, total:total});
    }).catch(function(err){
        next(err);
    });
});