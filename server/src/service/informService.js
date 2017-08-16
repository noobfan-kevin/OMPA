/**
 * Created by wangziwei on 2015/11/19.
 */
var Inform = process.core.db.models.Inform;
//var User = process.core.db.models.User;
var log = process.core.log;
var async = require('async');

var informService = module.exports;

// 新建公告
informService.create = function(inform){
    return Inform.create(inform);
};

// 根据主键ID获公告信息
informService.getById = function (id) {
    return Inform.findById(id);
};

// 根据主键ID删公告信息
informService.deleteById = function (id) {
    return informService.getById(id).then(function (dbInform) {
        return dbInform.destroy();
    });
};

// 数量
informService.informCount = function (conditions) {
    return Inform.count(conditions);
};

/**
 *
 * @param args attributes:查询字段,where:查询条件,offset:跳过数据条数,limit:查询数据条数,order:排序,include:关联
 * 参考：http://note.youdao.com/groupshare/?token=1851646F75074E9C88180593AD747223&gid=11001280
 * @returns promise
 */
informService.query = function (args) {
    if (!args) {
        args = {};
    }
    var attributes = args.attributes;
    var where = args.where || {};
    var offset = args.offset || 0;
    var limit = args.limit;
    var order = args.order || [['createdAt', 'DESC']];
    var include = args.include ;
    return Inform.all(
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
informService.updateById = function (id, inform) {
    return informService.getById(id).then(function (dbInform) {
        return dbInform.update(inform);
    });
};

informService.updateReadStatus = function (id, userId) {
    return informService.getById(id).then(function (dbInform) {
        var res = dbInform.receivers.slice();
        res.forEach(function (rec) {
            if( rec.id === userId ) {
                rec.isRead = true;
            }
        });
        dbInform.receivers = res;
        return dbInform.save();
    });
};