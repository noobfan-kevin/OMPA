/**
 * Created by wangziwei on 2015/11/19.
 */
var Credit = process.core.db.models.Credit;
var log = process.core.log;
var async = require('async');

var taskVersionService = require('./taskVersionService');

var creditService = module.exports;

// 新建积分
creditService.create = function(credit){
    return Credit.create(credit);
};

/**
 *
 * @param credit  include taskVersionId and percent and name  保存的积分比实际值大100倍
 */
creditService.createByTaskVersionId = function (credit) {
    return taskVersionService.getById(credit.taskVersionId).then(function (dbTaskVersion) {
        credit.scores = Math.round(dbTaskVersion.points * credit.percent);
        credit.name = dbTaskVersion.name + '-' +credit.name;
        return creditService.create(credit);
    });
};

// 根据主键ID获积分信息
creditService.getById = function (id) {
    return Credit.findById(id);
};

// 根据主键ID删积分信息
creditService.deleteById = function (id) {
    return creditService.getById(id).then(function (dbCredit) {
        return dbCredit.destroy();
    });
};

// 数量
creditService.creditCount = function (conditions) {
    return Credit.count(conditions);
};

// 总积分
creditService.countCreditTotal = function (conditions) {
    return creditService.query(conditions).then(function (dbCredits) {
        var result = 0;
        dbCredits.forEach(function (dbCredit){
            result += dbCredit.scores;
        });
        return result;
    });
};

/**
 *
 * @param args attributes:查询字段,where:查询条件,offset:跳过数据条数,limit:查询数据条数,order:排序,include:关联
 * 参考：http://note.youdao.com/groupshare/?token=1851646F75074E9C88180593AD747223&gid=11001280
 * @returns promise
 */
creditService.query = function (args) {
    if (!args) {
        args = {};
    }
    var attributes = args.attributes;
    var where = args.where || {};
    var offset = args.offset || 0;
    var limit = args.limit;
    var order = args.order || '';
    var include = args.include ;
    return Credit.all(
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

// 修改
creditService.updateById = function (id, credit) {
    return creditService.getById(id).then(function (dbCredit) {
        return dbCredit.update(credit);
    });
};


