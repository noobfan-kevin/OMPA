/**
 * Created by hk054 on 2016/4/19.
 */
/**
 * Created by hk61 on 2016/4/19.
 */
/**
 * Created by hk61 on 2016/4/18.
 */
var express = require('express');

var router = module.exports = express.Router();

var stepTreeService = require('../service/stepTreeService');
var stepMemberUtils = require('../dbUtils/stepMemberUtils');
var userLog = require('../core/userLog');
var _ = require('lodash');
var roles = require('../core/auth').roles;



/*
 * @api {get} /api/stepAsset/:stepAssetId 根据ID,获取步骤和成员信息
 *
 * */
router.get('/:stepAssetId', function (req, res, next) {
    var id = req.params.stepAssetId;

    stepTreeService.getById(id).then(function (dbStepInfo) {
        return stepTreeService.getNodeMember(id).then(function(member) {
            dbStepInfo.dataValues.member = member;
            return res.json({ok: true, list:dbStepInfo});
        })
    }).catch(function(err){
        next(err);
    });
});


/*
 * @api {post} /api/stepAsset/ 创建步骤
 * @apiParam {JSON} 步骤信息
 *
 * */
router.post('/', function (req, res, next) {
    req.body.creatorId = req.session.user ? req.session.user.id : req.body.taskCardLeaderId;
    stepTreeService.insertChild(req.body, 2).then(function (dbStep) {
        return stepTreeService.addNodeMember(dbStep, req.body).then(function() {
            userLog.log({type: 0, projectId: req.body.projectId , description: '创建了资产节点：' + req.body.name});
            return res.json({ok: true, list:dbStep});
        });
    }).catch(function(err){
        next(err);
    });
});


/*
 * @api {put} /api/stepAsset/:stepAssetId 根据ID,更新步骤
 * @apiParam {JSON} 步骤信息
 *
 * */
router.put('/:stepAssetId', function (req, res, next) {
    var data = req.body;
    var id = req.params.stepAssetId;
    var deleteUsers
        , leaderIds = [data.taskCardLeaderId, data.contractLeaderId, data.payLeaderId ]
        , afterUsers = _.uniq(JSON.parse(data.member).concat(leaderIds));

    data.creatorId = req.session.user ? req.session.user.id : data.taskCardLeaderId;

    stepTreeService.getById(id).then(function (dbStepInfo) {
        return stepTreeService.getNodeMember(id).then(function(member) {
            dbStepInfo.dataValues.member = member;
            return dbStepInfo.dataValues;
        })
    }).then(function(oldStepInfo) {
        stepMemberUtils.getStepMemberIdsById(id).then(function(ids) {

            deleteUsers = stepMemberUtils.without(_.uniq(ids), afterUsers);
            return stepMemberUtils.queryStepChildrenInCharge(id, deleteUsers);

        }).then(function(results) {

            if(results.ok){
                stepTreeService.updateNodeInfo(id, req.body, 2).then(function (dbStepInfo) {
                    return stepTreeService.updateNodeMember(dbStepInfo, req.body).then(function(newDbs) {
                        //userLog.log({type: 0, projectId: req.body.projectId , description: '修改了资产节点：' + req.body.name});
                        /* ===== 操作记录 ==== */
                        var newStepInfo = newDbs;
                        userLog.log(function() {
                            var desc = '', modified = false, sName, sMove, sTaskLeader, sContractLeader, sPayLeader
                                , sAddUser, sDeleteUser, delUsers, addUsers, xorUsers, xorTemp;

                            sName = oldStepInfo.name == req.body.name ?
                                    '' : '\r\n节点名： 由 ' + oldStepInfo.name + ' 改为 ' + req.body.name;
                            sMove = oldStepInfo.fatherId == req.body.fatherId ?
                                    '': '\r\n移动资产节点:'  + req.body.name;
                            sTaskLeader = newStepInfo.member.taskCardLeader.id == oldStepInfo.member.taskCardLeader.id ?
                                          '': '\r\n任务卡负责人： 由 ' + oldStepInfo.member.taskCardLeader.name + ' 改为 ' + newStepInfo.member.taskCardLeader.name;
                            sContractLeader = newStepInfo.member.contractLeader.id == oldStepInfo.member.contractLeader.id ?
                                          '': '\r\n合同负责人： 由 ' + oldStepInfo.member.contractLeader.name + ' 改为 ' + newStepInfo.member.contractLeader.name;
                            sPayLeader = newStepInfo.member.payLeader.id == oldStepInfo.member.payLeader.id ?
                                          '': '\r\n支付负责人： 由 ' + oldStepInfo.member.payLeader.name + ' 改为 ' + newStepInfo.member.payLeader.name;

                            xorUsers = _.xorBy(newStepInfo.member.member, oldStepInfo.member.member, 'id');
                            xorTemp = xorUsers.concat();
                            addUsers = _.pullAllBy(xorUsers, oldStepInfo.member.member).map(function(user) {return user.name});
                            delUsers = _.pullAllBy(xorTemp, newStepInfo.member.member).map(function(user) {return user.name});
                            sAddUser = addUsers.length ? '\r\n添加成员：' + addUsers.join(' , ') : '';
                            sDeleteUser = delUsers.length ? '\r\n删除成员：' + delUsers.join(' , ') : '';

                            desc = sName + sMove + sTaskLeader + sContractLeader + sPayLeader + sAddUser + sDeleteUser;

                            if(modified = !!desc){
                                desc = '修改资产结构：' + (!!sMove ? sMove : desc);
                            }

                            return {
                                type: 0,
                                projectId: req.body.projectId,
                                description: desc,
                                modified: modified
                            }

                        });
                        /*------- 操作记录 --- end -------*/
                        return res.json({ok: true, list:newDbs, inCharge: results.inCharge , message: results.messages});
                    });
                })
            }else{
                return res.json(results);
            }

        })
    }).catch(function(err){
        next(err);
    })

});

/*
 * @api {delete} /api/stepAsset/:stepAssetId 根据ID删除（包含子节点，不可删除 ok=false ）
 *
 * */
router.delete('/:stepAssetId', function (req, res, next) {
    var id = req.params.stepAssetId;
    var projectId,name;

    stepTreeService.getById(id).then(function(db) {
        projectId = db.getDataValue('projectId');
        name = db.getDataValue('name');
        stepTreeService.deleteById(id, 2).then(function (results) {
            return stepTreeService.deleteNodeMember(id).then(function() {
                userLog.log({type: 0, projectId: projectId , description: '删除了资产节点：' + name });
                return res.json(results);
            });
        })
    }).catch(function(err){
        next(err);
    });


});

/*
 * @api {get} /api/stepAsset/getAllByProjectId/:projectId 根据项目ID，获取所有步骤信息
 *
 * */
router.get('/getAllByProjectId/:projectId', function (req, res, next) {
    var projectId = req.params.projectId;

    stepTreeService.getAllByProjectId(projectId, 2).then(function (dbStep) {
        res.json({ok: true, list:dbStep});
    }).catch(function(err){
        next(err);
    });

});

/*
 * @api {get} /api/stepAsset/getMemberById/:stepId 根据步骤id，获取成员信息
 *
 * */
router.get('/getMemberById/:stepId', function (req, res, next) {
    var stepId = req.params.stepId;

    stepTreeService.getNodeMember(stepId).then(function(member){
        res.json({ok: true, list:member});
    }).catch(function(err){
        next(err);
    });

});

/*
 * @api {get} /api/stepShot/getMemberForSelectById/:stepId 根据步骤id，获取可选成员信息
 *
 * */
router.get('/getMemberForSelectById/:stepId', function (req, res, next) {
    var stepId = req.params.stepId;

    stepTreeService.getById(stepId).then(function(dbStep) {

        if(dbStep.dataValues.fatherId){
            stepTreeService.getNodeMember(dbStep.dataValues.fatherId).then(function(member){
                res.json({ok: true, list:member});
            })
        }else{
            stepTreeService.getProjectMember(dbStep.dataValues.projectId).then(function(member){
                res.json({ok: true, list:member});
            })
        }
    }).catch(function(err){
        next(err);
    });

});

/*
 * @api {get} /api/stepAsset/getNotChildrenNodes/:stepId 获取指定步骤的所有非子孙节点(也不包含自己)
 *
 * */
router.get('/getNotChildrenNodes/:stepId', function (req, res, next) {
    var stepId = req.params.stepId;

    stepTreeService.getOtherStepInfoById(stepId, 2).then(function(dbSteps){
        res.json({ok: true, list:dbSteps});
    }).catch(function(err){
        next(err);
    });

});

/*
 * @api {get} /api/stepAsset/getRootByProjectId/:projectId 根据项目Id获取根节点
 * */
router.get('/getRootByProjectId/:projectId', function (req, res, next) {
    var projectId = req.params.projectId;

    stepTreeService.getRootByProjectId(projectId, 2).then(function(dbSteps){
        res.json({ok: true, list:dbSteps});
    }).catch(function(err){
        next(err);
    });

});

/*
 获取每个部门下的参与节点的人员
 * **/
router.post('/getModelMember',function(req,res,next){
    var departmentId=req.body.departmentId;
    var nodeId=req.body.nodeId;
    stepTreeService.getModelMembers(departmentId,nodeId).then(function(data){
        console.log('9999',JSON.stringify(data));
        res.json({message:'success',data:data});
    }).catch(function(err){
        next(err);
    });
});

/*
 获取每个部门下的参与项目的人员
 * **/
router.post('/getProjectMember',function(req,res,next){
    var departmentId=req.body.departmentId;
    var projectId=req.body.projectId;
    stepTreeService.getProjectMembers(departmentId,projectId).then(function(data){
        res.json({message:'success',data:data});
    }).catch(function(err){
        next(err);
    });
});

/*
 根据项目id和合同负责人id获取
 * **/
router.post('/contractLeaderId',function(req,res,next){
    var contractLeaderId=req.body.contractLeaderId;
    var projectId=req.body.projectId;
    stepTreeService.getStepIdsByContractLeader(contractLeaderId, projectId, 2).then(function(data){
        res.json({message:'success',data:data});
    }).catch(function(err){
        next(err);
    });
});


/*
 查询指定user，角色为支付负责人、合同负责人的步骤
 * **/
router.get('/leadersStep/:userId',function(req,res,next){
    var userId=req.params.userId;
    stepTreeService.getLeadersStepByUserId(userId, 2, 3).then(function(data1){
        stepTreeService.getLeadersStepByUserId(userId, 2, 4).then(function(data2) {
            res.json({message:'success',data:{'contract':data1, 'pay': data2}});
        });
    }).catch(function(err){
        next(err);
    });
});