/**
 * Created by YanJixian on 2015/7/17.
 */

var express = require('express');
var router = module.exports = express.Router();
var departmentService = require('../service/departmentService');
var roles = require("../core/auth").roles;
var Department = process.core.db.models.Department;
var Father = process.core.db.models.Father;
var userService=require('../service/userService');
var rolesAdmin = [0];
var rolesLeader = [0,1];
var rolesUser = [0,1,2,3];

var io = process.core.io;
/*-----------------------start---------黄晓萌------------------------------------*/
router.post('/getDepById',function (req, res, next) {
    var departmentId = req.body.departmentId;
    departmentService.getById(departmentId,{attributes: ['name','id','fatherId','desc'],include:[Father]}).then(function (dbDepartment) {
        res.json(dbDepartment);
    }).catch(function(err){
        next(err);
    });
});

router.get('/getDepList', function (req, res, next) {
    //console.log('数据到服务器了')
    //console.log('api where');
    //console.log(req.query);
    departmentService.query({attributes: ['name','id','fatherId','desc'],
    order:[["createdAt"]]},req.query).then(function (list) {
        res.result = {ok: true, desc: '查询列表'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });
});

router.post('/updateDep',function(req,res,next){
    var departmentId = req.body.id;
    delete req.body['id'];
    departmentService.updateById(departmentId, req.body).then(function () {
        res.result = {ok: true, target: departmentId, desc: '更新部门'};
        res.json({ok:true});
    }).catch(function(err){
        next(err);
    });
});

router.post('/newDep',function(req,res, next){
    departmentService.create(req.body).then(function (dbDm) {
        res.result = {ok: true, target: dbDm._id, desc: '添加部门'};  //记录日志
        res.json(dbDm);
    }).catch(function(err){
        next(err);
    });
});


router.post("/delById", function (req, res, next) {
    var departmentId = req.body.id;
    departmentService.deleteById(departmentId).then(function(){
        res.result = {ok: true, target: departmentId, desc: '删除部门'};
        res.json({ok:true});
    }).catch(function(err){
        next(err);
    });
});

router.post('/getDepartmentUser',function(req,res,next){
    var departmentId=req.body.departmentId;
    console.log(departmentId);
    userService.getDepartmentUser(departmentId).then(function(departmentUsers){
        console.log('dede'+JSON.stringify(departmentUsers));
        res.json({data:departmentUsers});
    }).catch(function(err){
        next(err);
    });
});

/*------------------------------------------end--------------------------------------*/


/**
 * @api {post} /api/department 管理员添加部门
 * @apiName AddDepartment
 * @apiGroup Department
 * @apiPermission admin
 *
 * @apiParam {String} name 部门名称
 * @apiParam {String} fatherId 父级部门id
 *
 * @apiSuccess {String} _id 部门id
 * @apiSuccess {String} fatherId=0 父级部门id
 * @apiSuccess {String} name 部门名称
 * @apiSuccess {Date} createTime 建立时间
 *
 */
router.post('',roles(rolesAdmin),function(req,res, next){
    departmentService.create(req.body).then(function (dbDm) {
        res.result = {ok: true, target: dbDm._id, desc: '添加部门'};  //记录日志
        res.json(dbDm);

        io.sockets.emit('UpdateDepartment', {type:'add', _id:dbDm._id, name: dbDm.name});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/department/count 查询部门数
 * @apiName GetDepartmentCount
 * @apiGroup Department
 * @apiPermission admin
 *
 * @apiParam {Object} [conditions = {}] 查询条件
 *
 * @apiSuccess {Number} count 符合条件的部门数
 *
*/
router.get('/count',roles(rolesAdmin), function (req, res, next) {

    departmentService.departmentTotal(req.query.conditions || {}).then(function (count) {
        res.json({ok: true, count:count})
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/department/members 查询部门及成员
 * @apiName GetDepartmentAndMemberList
 * @apiGroup Department
 * @apiPermission admin
 *
 * @apiParam {Object} [conditions={}] 查询条件
 * @apiParam {String} [fields=""] 查询字段
 * @apiParam {Object} [options={}] 查询选项，分页、排序
 *
 * @apiParamExample {json} 分页请求部门和成员:
 *  {
 *      conditions: {},
 *      fields: "",
 *      options: {skip: 10,limit: 5}
 *  }
 *
 * @apiSuccess {Array} list 部门数组
 *
 */
router.get('/members', function (req, res, next) {
    departmentService.queryDepartmentAndUsers(req.query).then(function (list) {
        res.result = {ok: true, desc: '查询列表'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });
});


/**
 * @api {get} /api/department/exist 部门名称是否存在
 * @apiName QueryDepartmentName
 * @apiGroup Department
 *
 * @apiParam {String} name 部门名称
 *
 @apiSuccess {Boolean} ok 是否存在
 *
 */
router.get('/exist',function (req, res, next) {
    var departmentName = req.query.name;
    //departmentService.getByDepartmentName(departmentName).then(function (dbDepartmentName) {
    //    res.json(dbDepartmentName ? {ok: true}: {ok: false});
    //}).catch(function(err){
    //    next(err);
    //});
});


/**
 * @api {get} /api/department/:departmentId 查询部门信息
 * @apiName GetDepartment
 * @apiGroup Department
 * @apiPermission admin
 *
 * @apiParam {String} departmentId 部门Id
 *
 * @apiSuccess {String} _id 部门id
 * @apiSuccess {String} fatherId=0 父级部门id
 * @apiSuccess {String} name 部门名称
 * @apiSuccess {Date} createTime 建立时间
 *
 */
router.post('/:departmentId',function (req, res, next) {
    var departmentId = req.body.departmentId;
    departmentService.getById(departmentId).then(function (dbDepartment) {
        res.json(dbDepartment);
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/department 查询部门列表
 * @apiName GetDepartmentList
 * @apiGroup Department
 * @apiPermission admin
 *
 * @apiParam {Object} [conditions={}] 查询条件
 * @apiParam {String} [fields=""] 查询字段
 * @apiParam {Object} [options={}] 查询选项，分页、排序
 *
 * @apiParamExample {json} 分页请求部门name字段:
 *      conditions = {} &
 *      fields = "name" &
 *      options = {skip: 10,limit: 5}
 *
 * @apiSuccess {Array} list 部门数组
 *
 */
router.get('/', function (req, res, next) {
    departmentService.query(req.body).then(function (list) {
        res.result = {ok: true, desc: '查询列表'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });
});



/**
 * @api {put} /api/department/:departmentId 修改部门信息
 * @apiName EditDepartment
 * @apiGroup Department
 * @apiPermission admin
 *
 * @apiParam (params) {String} departmentId 部门Id
 *
 * @apiParam (body) {String} [name] 部门名称
 * @apiParam (body) {String} [fatherId] 父级部门id
 *
 * @apiSuccess {Boolean} ok 更新操作是否成功
 *
 */
router.put('/:departmentId',roles(rolesAdmin),function(req,res, next){
    var departmentId = req.params.departmentId;
    departmentService.updateById(departmentId, req.body).then(function () {
        res.result = {ok: true, target: departmentId, desc: '更新部门'};
        res.json({ok:true});

        io.sockets.emit('UpdateDepartment', {type:'modify', _id:departmentId, body: req.body});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {delete} /api/department/:departmentId 删除部门
 * @apiName DeleteDepartment
 * @apiGroup Department
 * @apiPermission admin
 *
 * @apiParam {String} departmentId 需要删除的部门id
 *
 * @apiSuccess {Boolean} ok 删除操作是否成功
 *
 */
router.delete("/:departmentId",roles(rolesAdmin), function (req, res, next) {
    var departmentId = req.params.departmentId;
    departmentService.deleteById(departmentId).then(function(){
        res.result = {ok: true, target: departmentId, desc: '删除部门'};
        res.json({ok:true});

        io.sockets.emit('UpdateDepartment', {type:'delete', _id:departmentId});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/department/:departmentId/members 查询部门成员
 * @apiName GetDepartmentMembers
 * @apiGroup Department
 * @apiPermission admin
 *
 * @apiParam {String} departmentId 部门Id
 *
 * @apiSuccess {Array} list 成员数组
 *
 */
router.get('/:departmentId/members',roles(rolesAdmin), function (req, res, next) {
    var id = req.params.departmentId;
    departmentService.queryUsersByDepartmentId(id).then(function (list) {
        res.json({ok: true, list: list});
    }).catch(function(err){
        next(err);
    });
});