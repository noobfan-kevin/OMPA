/**
 * Created by HeLiang on 2016/7/6.
 */
var express = require('express');
var router = module.exports = express.Router();
var payDataBaseService = require('../service/payDataBaseService');

/**
 * @api {get} /api/fundDataBase 获取文件列表
 * @apiName GetFileList
 * @apiGroup fundDataBase
 * @apiPermission all
 *
 * @apiParam {Object} [conditions={}] 查询条件
 * @apiParam {String} [fields=""] 查询字段
 * @apiParam {Object} [options={}] 查询选项，分页、排序
 *
 * @apiParamExample {json} 请求用户aa上传的文件:
 *  {
 *      conditions: {authorId：'aa'}
 *  }
 *
 * @apiSuccess {Array} list 文件数组
 *
 */
router.get('/project/:projectId', function (req, res, next) {

    var projectId = req.params.projectId;
    payDataBaseService.getFundByProjectId(projectId).then(function (list) {
        res.result = {ok: true, desc: '查询列表'};
        res.json(list);
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/fundDataBase/index 获取文件列表
 * @apiName GetFileList
 * @apiGroup fundDataBase
 * @apiPermission all
 *
 *
 * @apiParam {String} Id 文件Id
 *
 *
 *
 * @apiSuccess {Array} list 文件数组
 *
 */
/*router.get('/index/:id', function (req, res, next) {
 var id = req.params.id;
 fundDataBaseService.getById(id).then(function (folder) {
 fundDataBaseService.queryFoldersByFather(folder).then(function (list) {
 res.result = {ok: true, desc: '查询列表'};
 res.json(list);
 });
 }).catch(function(err){
 next(err);
 });
 });*/
/**
 * @api {get} /api/fundDataBase/:fileId 查询文件信息
 * @apiName GetFile
 * @apiGroup fundDataBase
 * @apiPermission all
 *
 * @apiParam {String} fileId 文件Id
 *
 * @apiSuccess {String} originalName 上传文件原文件名
 * @apiSuccess {String} filename 上传后的文件名
 * @apiSuccess {String} path 上传后的文件相对路径
 * @apiSuccess {String} ext 文件后缀名
 * @apiSuccess {String} size 文件大小
 * @apiSuccess {String} sourceKey 来源主键编号
 * @apiSuccess {Number} sourceType 来源类型
 * @apiSuccess {String} authorId 上传作者
 * @apiSuccess {Date} time 上传时间
 *
 */


router.post('/',function (req, res, next) {
    var payInfo = req.body;

    payDataBaseService.create(payInfo).then(function (fl) {
        res.json({ok: true, info: fl.dataValues});
    }).catch(function (err) {
        next(err);
    });

});

/**
 * @api {delete} /api/fundDataBase/:fileId 删除文件
 * @apiName DeleteFile
 * @apiGroup fundDataBase
 * @apiPermission all
 *
 * @apiParam {String} fileId 文件Id
 *
 * @apiSuccess {Boolean} ok 删除操作是否成功
 *
 */
router.delete('/:id', function (req, res, next) {
    var id = req.params.id;
    payDataBaseService.deleteById(id).then(function (result) {
        res.json({ok: true, desc: '删除成功！'})
    }).catch(function(err){
        next(err);
    });

});


/**
 * @api {post} /api/fundDataBase/update 修改文件文件夹信息接口
 * @apiName update
 * @apiGroup fundDataBase
 * @apiPermission all
 *
 * @apiParam {String}  name 文件夹或文件名称

 *
 * @apiSuccess {Boolean} ok 修改操作是否成功
 *
 */

router.put('/:payId',function (req, res, next) {
    var payId = req.params.payId;
    var data = req.body.data;
    payDataBaseService.updateById(fundId, data).then(function(dbFile){
        res.json({ok: true,result:dbFile});
    }).catch(function (error) {
        next(error)
    });
});

router.get('/:payId',function (req, res, next) {
    var payId = req.params.payId;
    payDataBaseService.getById(payId).then(function (dbFile) {
        ////console.log(dbFile);
        res.json(dbFile);
    }).catch(function(err){
        next(err);
    });
    /*
     fundDataBaseService.getById(fileId, function (err, dbFile) {
     if (err) {
     next(err);
     } else {
     res.json(dbFile);
     }
     });
     */
});


router.post('/page',function (req, res, next) {
    var page = req.body.page;
    var projectId = req.body.projectId;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;


    var whereTime = {
        $gte: startTime,
        $lte: endTime
    };

    if(!startTime) delete whereTime['$gte'];
    if(!endTime) delete whereTime['$lte'];

    var where = {
        projectId: projectId,
        createdAt: whereTime
    };
    if(!startTime && !endTime) delete where['createdAt'];
    payDataBaseService.queryByPage({
        page: page ,
        where: where
    }).then(function (dbFile) {
        res.json(dbFile);
    }).catch(function(err){
        next(err);
    });
});
