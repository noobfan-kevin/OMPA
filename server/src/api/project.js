/**
 * Created by wangziwei on 2015/8/11.
 */
var express = require('express');
var router = module.exports = express.Router();
var log = process.core.log;
var ProjectService = require('../service/projectService');
var MessageStatusService = require('../service/messageStatusService');
var stepInfoService = require('../service/stepTreeService');
var io = process.core.io;
//var roles = require('../../core/auth').roles;


/**
 * @api {post} /api/project 新建项目
 * @apiName AddProject
 * @apiGroup Project
 * @apiPermission leader
 *
 * @apiParam {String} name 项目名称
 * @apiParam {String} authorId 作者编号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.post('/',function(req,res,next){
   // console.log(req.body);
    ProjectService.getByProjectName(req.body.name,req.body.parentId).then(function(proj){
        if(proj===null) {
            ProjectService.create(req.body).then(function(results){
                if(req.body.creatorId)
                {
                    var members=[];
                    members.push(req.body.creatorId);
                    ProjectService.addMembers(results.dataValues.id,members,1).then(function(results2){
                        MessageStatusService.addProUsersStatus(members,results.dataValues.id);
                        //console.log(results2[0][0].dataValues);
                        results.dataValues.User=results2[0][0].dataValues;
                       // console.log(results);
                        res.json(results);
                    });
                }
                else
                {
                    res.json(results);
                }
            });
        }
        else{
            res.json({ok:false,desc:"项目名称重复"});
        }
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {post} /api/project/addMembers 添加成员
 * @apiName AddProjectMembers
 * @apiGroup Project
 * @apiPermission leader
 *
 * @apiParam {String} id 项目编号
 * @apiParam {Array} members 成员编号
 * @apiParam {Number} job 用户职位
 * @apiParam {String} moduleId 模块编号（模块添加成员时候需要填写）
 *
 * @apiSuccess {Array} results 操作结果
 */
router.post('/addMembers',function(req,res,next){
    var members = JSON.parse(req.body.members);
    ProjectService.getById(req.body.id).then(function(pro){
        if(pro.dataValues.parentId&&pro.dataValues.parentId!=null)
        {
            ProjectService.addMembers(pro.dataValues.parentId,members,req.body.job,req.body.id).then(function(results){
                MessageStatusService.addProUsersStatus(members,pro.dataValues.parentId);
                res.json(results);
            });
        }
        else
        {
            ProjectService.addMembers(req.body.id,members,req.body.job).then(function(results){
                MessageStatusService.addProUsersStatus(members,req.body.id);
                res.json(results);
            });
        }

    }).catch(function(error){
        next(error);
    });

});


/**
 * @api {put} /api/project 修改
 * @apiName updateProject
 * @apiGroup Project
 * @apiPermission all
 *
 * @apiParam (params) {String} id 项目编号
 * @apiParam (body) {Numeber} status 项目状态 0：开始 1：结束
 *
 * @apiSuccess {Array} results 更新结果
 *
 */
router.put('/:projectId',function(req,res,next){
    var projectId = req.params.projectId;

    ProjectService.getByProjectName(req.body.name).then(function(dbProject){
        if(dbProject != projectId) {
            ProjectService.updateById(projectId,req.body).then(function(results){
                res.result = {ok: true, target: results._id, desc: "修改项目"};
                res.json(results);
            }).catch(function(err){
                next(err);
            });
        }else{
            res.json({ok:false,desc:"项目名称重复"});
        }
    }).catch(function(err){
        next(err);
    });


});

/**
 * @api {delete} /api/project/delMembers 删除项目成员
 * @apiName DeleteMember
 * @apiGroup Project
 *
 * @apiParam (body){String} projectId 项目编号
 * @apiParam (body){String} memberId 用户编号
 * @apiParam (body){String} moduleId 模块编号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.delete('/delMembers',function(req,res,next){
    var projectId = req.query.projectId;
    var memberId = req.query.memberId;
    var moduleId = req.query.moduleId;
    ProjectService.removeMember(projectId,memberId,moduleId).then(function(){
        res.result = {ok: true, target: projectId, desc: "删除项目成员"};
        res.json({ok:true});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {delete} /api/project/:projectId 删除项目
 * @apiName DeleteProject
 * @apiGroup Project
 * @apiPermission leader
 *
 * @apiParam {String} projectId 项目编号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.delete('/:projectId',function(req,res,next){
    var projectId = req.params.projectId;
    ProjectService.delStep(projectId).then(function() {
        ProjectService.deleteById(projectId).then(function(){
            res.result = {ok: true, target: projectId, desc: "删除项目"};
            res.json({ok:true});
        }).catch(function(err){
            next(err);
        });
    });

});


/**
 * @api {get} /api/project/newtaskandinform 项目是否有待处理任务
 * @apiName HasTaskAndInform
 * @apiGroup Project
 * @apiPermission All
 *
 * @apiParam {String} userId 用户编号
 * @apiParam {Array} projectIds 项目id
 *
 * @apiSuccess {Array} arr 结果数组{prjId: result}
 */
router.get('/newtaskandinformandchat',function(req,res,next){
    var userId = req.query.userId;
    var projectIds = JSON.parse(req.query.projectIds);
    ProjectService.hasNewTaskOrInformAll(projectIds, userId).then(function (arr) {
        res.json(arr);
    }).catch(function(err){
        next(err);
    });
});

router.get('/newtaskandinform',function(req,res,next){
    var userId = req.query.userId;
    var projectIds = JSON.parse(req.query.projectIds);
    ProjectService.hasNewTaskOrInformAll(projectIds, userId,true).then(function (arr) {
        res.json(arr);
    }).catch(function(err){
        next(err);
    });
});
/**
 * @api {get} /api/project/byuser/:userId 取得指定用户的所有项目信息
 * @apiName GetAllProjectByUser
 * @apiGroup Project
 * @apiPermission user
 *
 * @apiParam {String} userId 用户ID
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Array} list 结果数组·
 */
router.get('/byuser/:userId',function(req,res,next){
    if (req.query.where && typeof req.query.where === 'string') {
        req.query.where = JSON.parse(req.query.where);
    }
    if(req.query.where&&!req.query.where.parentId){
        req.query.where.parentId = null;
    }
    var userId = req.params.userId;
    ProjectService.queryByUser(userId, req.query).then(function (results) {
        res.result = {ok: true,desc: "获取全部项目信息"};

        res.json({ok: true, list:results});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/project/ 取得所有项目信息
 * @apiName GetAllProject
 * @apiGroup Project
 * @apiPermission leader
 *
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Array} list 结果数组·
 */
router.get('/',function(req,res,next){
    var userId=req.query.userId;
    //console.log('userId--------',userId);
    if (req.query.where && typeof req.query.where === 'string') {
        req.query.where = JSON.parse(req.query.where);
    }
/*    if(req.query.where&&!req.query.where.parentId){
        req.query.where.parentId = null;
    }*/
    ProjectService.query(req.query).then(function (results) {
        res.result = {ok: true,desc: "获取全部项目信息"};

        res.json({ok: true, list:results});
    }).catch(function(err){
        next(err);
    });
});

/*
 * 获取所有当前用户的项目（管理、查看权限）
 * * @api {get}/api/project/getCurUserProjectAuthority
 * * @params{userId}
 * */
router.get('/getCurUserProjectAuthority',function(req,res,next){
    var userId=req.query.userId;
    ProjectService.getCurUserProjectAuthority(userId).then(function(data){
        res.json({message:'ok',data:data});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/project/count 查询项目总数
 * @apiName GetProjectCount
 * @apiGroup Project
 * @apiPermission all
 *
 * @apiParam {Object} [conditions = {}] 查询条件
 *
 * @apiSuccess {Number} count 符合条件的通知数
 *
 */
router.get('/count', function (req, res, next) {
    ProjectService.projectCount(req.query.conditions || {}).then(function (count) {
        res.json({ok: true, count:count});
    }).catch(function(err){
        next(err);
    });
});

router.get('/exist',function (req, res, next) {
    var projectName = req.query.projectName;
    ProjectService.getByProjectName(projectName).then(function (dbProject) {
        res.json(dbProject ? {ok: true}: {ok: false});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/project/queryRole/:projectId 根据项目编号查询用户角色分类
 * @apiName QueryRole
 * @apiGroup Project
 *
 * @apiParam (params){String} projectId 项目编号
 *
 * @apiSuccess {Array} dbProject 结果·
 */
router.get('/queryRole/:projectId',function (req, res, next) {
    var projectId = req.params.projectId;
    ProjectService.queryRoleByPrjId(projectId).then(function (dbProject) {
        res.json(dbProject );
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/project/:projectId 取得项目信息
 * @apiName GetProject
 * @apiGroup Project
 * @apiPermission leader
 *
 * @apiParam {String} projectId 项目编号
 *
 * @apiSuccess {String} name 项目名称
 * @apiSuccess {String} authorId 创建人编号
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Array} list 结果数组·
 */
router.get('/:projectId',function(req,res,next){
    var projectId = req.params.projectId;
    ProjectService.getById(projectId).then(function (results) {
        res.result = {ok: true,target: projectId, desc: "获取指定项目信息"};
        res.json({ok: true, list:results});
    }).catch(function(err){
        next(err);
    });
});




/**
 * 新建项目&编辑项目
 * */
router.post('/createProject',function(req,res,next){
     ProjectService.createProject(JSON.parse(req.body.data),req.body.leader,JSON.parse(req.body.users)).then(function(data){
         if(!(JSON.parse(req.body.data)['id'])){
             var projectId = data.project.dataValues.id;
             var member = JSON.parse(req.body.users);

             stepInfoService.createStep({
                 projectId:projectId,
                 name:'资产',
                 creatorId:req.session.user ? req.session.user.id :JSON.parse(req.body.data).creatorId,
                 member:JSON.stringify(member),
                 taskCardLeaderId:req.body.leader,
                 contractLeaderId:req.body.leader,
                 payLeaderId:req.body.leader,
                 lft:1,
                 rgt:2
             },2 );
             stepInfoService.createStep({
                 projectId:projectId,
                 name:'镜头',
                 creatorId:req.session.user ? req.session.user.id :JSON.parse(req.body.data).creatorId,
                 member:JSON.stringify(member),
                 taskCardLeaderId:req.body.leader,
                 contractLeaderId:req.body.leader,
                 payLeaderId:req.body.leader,
                 lft:1,
                 rgt:2
             },1 );
         }

         if(data.ok){
             res.json({ok: true,"message":data.messages,data:data.project});
         }else{
             res.json(data);
         }

     }).catch(function(err){
         next(err);
     });
});
//
///**
// * 查询一个项目的详细信息
// * */
//router.post('/selectProject',function(req,res,next){
//    var id=req.body.projectId;
//    ProjectService.selectProjectInfo(id).then(function(data){
//        console.log("projectdata"+JSON.stringify(data));
//        res.json({message:'ok',data:data});
//    }).catch(function(err){
//        next(err);
//    });
//});

/*
* 获取所有项目信息
*
* */
router.post('/selectAllProject',function(req,res,next){
    ProjectService.getAllProject().then(function(data){
        console.log("datadata+++"+JSON.stringify(data));
        res.json({message:'ok',data:data});
    }).catch(function(err){
        next(err);
    });
});



