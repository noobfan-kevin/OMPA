/**
 * Created by wangziwei on 2015/9/14.
 */
var Plan = process.core.db.models.Plan;
var File = process.core.db.models.File;
var log = process.core.log;
var async = require('async');

var planService = module.exports;

// 新建
planService.create = function(plan){
    return Plan.create(plan);
};

// 根据主键ID获取信息
planService.getById = function (id) {
    return Plan.findById(id);
};

// 根据任务卡号获取信息
planService.getByTaskVersionId = function (id) {
    return Plan.findOne({
        where: {
            taskVersionId: id
        }
    });
};

// 根据主键ID删除
planService.deleteById = function (id) {
    return planService.getById(id).then(function(dbPlan){
        return dbPlan.destroy();
    });
};

// 根据任务卡版本号删除方案
planService.deleteByVersionId = function(versionId){
    return Plan.destroy({
        where:{
            taskVersionId:versionId
        }
    });
};

// 修改
planService.updateById = function (id, plan, callback) {
    return planService.getById(id).then(function (dbPlan) {
        return dbPlan.update(plan);
    });
};

// 保存方案
planService.updateAndCreate = function(plan){
    if(plan.id){
        return planService.updateById(plan.id, plan);
    }
    else{
        return planService.create(plan)
    }
};

// 删除方案中存在的无用文件
planService.deleteRubbishFiles = function(id, fileIds) {

    return File.destroy({
        where: {
            sourceTable: Plan.getTableName(),
            sourceKey: {
                $or: [id, null]
            },
            id: {
                $notIn:fileIds
            }
        }
    });

};