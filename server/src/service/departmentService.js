/**
 * Created by wangziwei on 2015/11/17.
 */

var Department = process.core.db.models.Department;
var log = process.core.log;
var userService = require('./userService');

var departmentService = module.exports;

departmentService.create = function (department) {
    return Department.create(department);
};

/**
 *
 * @param where
 * @param department
 * @param useTransact 是否用事务，慢！
 * @returns {Promise.<Instance, created>} .spread((function(department, created){})
 */
departmentService.findOrCreate = function (where , department, useTransact) {
    if (useTransact) {

        return Department.findOrCreate({where: where, defaults: department});
    } else {
        return Department.findCreateFind({where: where, defaults: department});
    }
};

departmentService.getById = function (id,args) {
    return Department.findById(id,args);
};

departmentService.getByName = function (name) {
    return Department.findOne({
        where: {name: name}
    });
};

departmentService.updateById = function (id, department) {
    return departmentService.getById(id).then(function (dbDepartment) {
        return dbDepartment.update(department);
    });
};

departmentService.deleteById = function (id) {
    return departmentService.getById(id).then(function (dbDepartment) {
        return dbDepartment.destroy();
    });
};

/**
 *
 * @param args attributes:查询字段,where:查询条件,offset:跳过数据条数,limit:查询数据条数,order:排序,include:关联
 * 参考：http://note.youdao.com/groupshare/?token=1851646F75074E9C88180593AD747223&gid=11001280
 * @returns promise
 */
departmentService.query = function (args,where) {
//console.log('this is where:');console.log(where);
    return Department.all(args,{
        where:where
    });
};

departmentService.departmentTotal = function (conditions) {
    return Department.findAndCountAll(conditions);
};

departmentService.querySubDepartmentsById = function (id) {
    return departmentService.query({
        where: {fatherId: id}
    });
};

departmentService.queryUsersByDepartmentId = function (id) {
    return userService.queryByDepartmentId(id);
};

/**
 *
 * @param args [conditions={}] 查询条件,[fields=""] 所需参数, [options={}] 查询选项
 */
departmentService.queryDepartmentAndUsers = function (args) {
    return departmentService.query(Object.assign({include:'User'},args));
};
