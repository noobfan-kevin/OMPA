/**
 * Created by hk61 on 2016/4/27.
 */
var Project = process.core.db.models.Project;
var ProjectMember=process.core.db.models.ProjectMember;
var StepInfo = process.core.db.models.StepInfo;
var User = process.core.db.models.User;
var stepService = require("../service/stepTreeService");
var _ = require('lodash');


var stepMemberUtils = module.exports;

// 返回被删除的成员 ids
stepMemberUtils.without = function (aPre, aAfter) {
    return aPre.filter(function(val) {
        return aAfter.indexOf(val) == -1;
    })
};


// 查询要删除的人，是否为模块负责人
stepMemberUtils.queryInCharge = function (projectId, deleteUsers) {
    return StepInfo.all({ where: { projectId: projectId }, raw: true }).then(function(dbSteps) {
        // 所有与项目相关的步骤id
        var stepIds = dbSteps.map(function(step) {
            return step.id;
        });

        return ProjectMember.scope('inCharge').all({
            where:{
                moduleId: {$in: stepIds},
                userId: {$in: deleteUsers}
            },
            include: User
        }).then(function(dbs) {
            var inChargeUsers = expandUserInfo(dbs);
            if(inChargeUsers && inChargeUsers.length > 0){
                return {ok:false, inCharge: inChargeUsers, messages: '有模块负责人占用，不可删除'}
            }else{
                // 删除模块不同成员
                return ProjectMember.destroy({
                    where:{
                        moduleId: {$in: stepIds},
                        userId: {$in: deleteUsers},
                        role: 0
                    }
                }).then(function() {
                    return {ok: true, messages:'无负责人占用'}
                });

            }
        })
    });
};

// 返回包含User信息和模块id的对象
function expandUserInfo(dbModuleUser) {
    var arr;
    arr = dbModuleUser.map(function(user){
        return {
            id: user.User.id,
            name: user.User.name,
            role: user.role,
            moduleId: user.id
        }
    });
    arr = _.unionBy(arr, 'id');
    return arr;
}

// 更新项目根步骤成员
stepMemberUtils.updateRootModuleMember = function (projectId, members) {

    return StepInfo.scope('root').all({
        where: { projectId: projectId }
    }).then(function(dbModules){
        if(!dbModules || !dbModules.length) return [];
        return dbModules.map(function(module) { return module.dataValues.id; })
    }).then(function(moduleIds) {
        return ProjectMember.destroy({
            where: {
                moduleId: { $in: moduleIds },
                role: 0
            }
        }).then(function() {

            var shotMember = members.map(function(id) {
                return {
                    role: 0,
                    userId: id,
                    moduleId: moduleIds[0]
                };
            });
            var assetMember = members.map(function(id) {
                return {
                    role: 0,
                    userId: id,
                    moduleId: moduleIds[1]
                };
            });
            ProjectMember.bulkCreate(shotMember);
            ProjectMember.bulkCreate(assetMember);
        })
    })

};


// 查询子孙模块是否有负责人占用
stepMemberUtils.queryStepChildrenInCharge = function(stepId, deleteUsers) {

    return stepService.getChildrenById(stepId).then(function(dbSteps) {
        return dbSteps.map(function(dbStep) {
            return dbStep.getDataValue('id');
        });
    }).then(function(stepIds) {
        return ProjectMember.scope('inCharge').all({
            where: {
                moduleId: {$in: stepIds},
                userId: {$in: deleteUsers}
            },
            include: User
        }).then(function(dbs) {
            var inChargeUsers = expandUserInfo(dbs);
            if(inChargeUsers && inChargeUsers.length > 0){
                return {ok:false, inCharge: inChargeUsers, messages: '子孙模块负责人占用，不可删除'}
            }else{
                // 删除模块不同成员
                return ProjectMember.destroy({
                    where:{
                        moduleId: {$in: stepIds},
                        userId: {$in: deleteUsers},
                        role: 0
                    }
                }).then(function() {
                    return {ok: true, messages:'无负责人占用'}
                });
            }
        })
    })
};

stepMemberUtils.getStepMemberIdsById = function(id) {
    return ProjectMember.all({
        where: {moduleId: id}
    }).then(function(dbStepMember) {
        if(!dbStepMember || !Array.isArray(dbStepMember)) return [];
        return dbStepMember.map(function(dbMember) {
            return dbMember.getDataValue('userId');
        })
    })
};