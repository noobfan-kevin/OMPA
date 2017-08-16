/**
 * Created by wangziwei on 2015/7/28.
 */
var express = require('express');
var router = module.exports = express.Router();
var log = process.core.log;
var roleService = require('../service/roleService');
var roleAuthorityService = require('../service/roleAuthorityService');
var userRoleService = require('../service/userRoleService');
var authorityService = require('../service/authorityService');

var roles = require('../core/auth').roles;

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
/*router.post('/',function(req,res,next){
    req.body.attachments= JSON.parse(req.body.attachments);
    roleService.create(req.body, function(err,results){
        if(err){
            next(err);
        }
        else{
            res.result = {ok: true, target: results._id, desc: "新建通知"};
            res.json({ok:true, target: results._id});
        }
    });
});*/

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
/*router.delete('/:informId',function(req,res,next){
    var informId = req.params.informId;
    roleService.deleteById(informId,function(err,results){
        if(err){
            next(err);
        }
        else{
            res.result = {ok: true, target: informId, desc: "删除通知"};
            res.json({ok:true});
        }
    });
});*/

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
/*router.put('/:informId',function(req,res,next){
    var informId = req.params.informId;
    roleService.updateById(informId,req.body,function(err,results){
        if(err){
            next(err);
        }
        else{
            res.result = {ok: true,target: informId, desc: "修改通知"};
            res.json({ok:true});
        }
    });
});*/

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
/*router.get('/count', function (req, res, next) {

    roleService.informCount(req.query.conditions || {}, function (err, count) {
        if(!err){
            res.json({ok: true, count:count})
        }else{
            next(err)
        }
    });
});*/

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
/*router.get('/:informId',function(req,res,next){
    var informId = req.params.informId;
    roleService.getById(informId, function (err,results) {
        if(err){
            next(err);
        }
        else{
            res.result = {ok: true,target: informId, desc: "获取群信息"};
            res.json({ok: true, list:results});
        }
    });
});*/

/**
 * @api {get} /api/role 查询权限列表
 * @apiName GetRoleList
 * @apiGroup Role
 * @apiPermission all
 *
 * @apiParam {Object} [attributes] 查询字段
 * @apiParam {Object} [where] 查询条件
 * @apiParam {Numeber} [offset] 跳过数据条数
 * @apiParam {Number} [limit] 查询数据条数
 * @apiParam {Array} [order] 排序
 * @apiParam {Object} [include] 关联
 *
 * @apiSuccess {Array} list 通知数组
 *
 */
router.get('/', roles('Manage_department&user&role'), function (req, res, next) {
    roleService.query(
        {
            include: [{
                model: Authority,
                attributes: ['id', 'name', 'desc'],
                through: {
                    attributes: ['authorityId', 'f_rai_roleid']
                }
            }],
            order:[
                ['createdAt']
            ]
        }
    ).then( function (list) {
        res.result = {ok: true, desc: '查询所有角色'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {put} /api/role 添加角色并分配权限
 * @apiName addRole
 * @apiGroup Role
 * @apiPermission all
 *
 * @apiParam {Object} [role] 角色信息
 * @apiParam {Array} [Authorities] 权限ID数组
 *
 * @apiSuccess {Array} list 权限数组
 *
 */
router.post('', roles('Manage_department&user&role'), function(req, res, next) {
    var data = req.body;
    var role = JSON.parse(data.role);
    var Authorities = JSON.parse(data.Authorities);

    roleAuthorityService.createUserAuthority(role, Authorities).then( function(list) {
        res.result = {ok: true, desc: '创建角色权限'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });

});






/**
 * @api {put} /api/role 更新角色权限
 * @apiName updateRoleAuthorities
 * @apiGroup Role
 * @apiPermission all
 *
 * @apiParam {String} [roleId] 要修改的角色ID
 * @apiParam {Array} [Authorities] 权限ID数组
 *
 * @apiSuccess {Array} list 权限数组
 *
 */
router.put('/', roles('Manage_department&user&role'), function(req, res, next) {
    var data = req.body;
    var role = JSON.parse(data.role);
    var Authorities = JSON.parse(data.Authorities);

    roleAuthorityService.updateUserAuthority(role, Authorities).then( function(list) {
        res.result = {ok: true, desc: '更新角色权限'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });

});

router.delete('/', roles('Manage_department&user&role'), function(req, res, next) {
    var data = req.body;
    var roleId = data.roleId;
    roleService.deleteById(roleId).then( function(list) {
        res.result = {ok: true, desc: '删除角色'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });
});

//在用户角色表里查询byId
router.post('/FindById', function(req, res, next) {
    var data = req.body.roleId;
    //var id = data.roleId;
    console.log("Yyyy"+JSON.stringify(req.body));
    userRoleService.getById(data).then( function(list) {console.log(list);
        if(list){
            res.result = {ok: true, desc: '存在属于该角色的用户，该角色不可以删除！'};
            res.json({ok: true, list:list});
            console.log('有用户list：-----'+list);
        }else{
            res.result = {ok: true, desc: '不存在属于该角色的用户，可以删除！'};
            res.json({ok: true, list:list});
            console.log('没有用户list：-----'+list);
        }
    }).catch(function(err){
        next(err);
    });

});


/**
 * @api {get} /api/role/allAuthorities 获取所有权限
 * @apiName getAllAuthorities
 * @apiGroup Role
 * @apiPermission all
 *
 * @apiParam {Object} [attributes] 查询字段
 * @apiParam {Object} [where] 查询条件
 * @apiParam {Numeber} [offset] 跳过数据条数
 * @apiParam {Number} [limit] 查询数据条数
 * @apiParam {Array} [order] 排序
 * @apiParam {Object} [include] 关联
 *
 * @apiSuccess {Array} list 权限数组
 *
 */
router.get('/getAllAuthorities', roles('Manage_department&user&role'), function(req, res, next) {
    authorityService.query({
        attributes:['id','name','desc']
    }).then(function(list) {
        res.result = {ok: true, desc: '所有权限'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });

});

