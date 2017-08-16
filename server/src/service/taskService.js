/**
 * Created by YanJixian on 2015/11/19.
 */

var Task = process.core.db.models.Task;
var log = process.core.log;
var _= require('lodash');

var taskService = module.exports;


taskService.create = function (task) {
    return Task.create(task);
};

/**
 *
 * @param where
 * @param task
 * @param useTransact 是否用事务，慢！
 * @returns {Promise.<Instance, created>} .spread((function(task, created){})
 */
taskService.findOrCreate = function (where , task, useTransact) {
    if (useTransact) {

        return Task.findOrCreate({where: where, defaults: task});
    } else {
        return Task.findCreateFind({where: where, defaults: task});
    }
};

taskService.createAll = function (tasks) {
    return Task.bulkCreate(tasks);
};

taskService.getById = function (id) {
    return Task.findById(id);
};

taskService.updateById = function (id, task) {
    return taskService.getById(id).then(function (dbTask) {
        return dbTask.update(task);
    });
};

taskService.createOrUpdateById = function (id, task) {
    return taskService.findOrCreate({id: id}, task).spread(function (dbTask, created) {
        if (created) {
            return dbTask;
        } else {
            return dbTask.update(task);
        }
    });
};

taskService.deleteById = function (id) {
    return taskService.getById(id).then(function (dbTask) {
        return dbTask.destroy();
    });
};

/**
 *
 * @param args attributes:查询字段,where:查询条件,offset:跳过数据条数,limit:查询数据条数,order:排序,include:关联
 * 参考：http://note.youdao.com/groupshare/?token=1851646F75074E9C88180593AD747223&gid=11001280
 * @returns promise
 */
taskService.query = function (args) {
    if (!args) {
        args = {};
    }
    var attributes = args.attributes;
    var where = args.where || {};
    var offset = args.offset || 0;
    var limit = args.limit;
    var order = args.order || '';
    var include = args.include;
    return Task.all(
        {
            attributes: attributes,
            where: where,
            offset: offset,
            limit: limit,
            order: order,
            include: include
        }
    );
};

taskService.taskTotal = function (where) {
    return Task.count(where);
};