/**
 * Created by HeLiang on 2016/7/6.
 */
var PayDataBase=process.core.db.models.PayDataBase;//.core.db.models.PayDataBase;
var FundDataBase=process.core.db.models.FundDataBase;//.core.db.models.PayDataBase;
var Creator = process.core.db.models.Creator;
var async = require('async');

var payDataBaseService = module.exports;

payDataBaseService.create = function (file) {
    return PayDataBase.create(file);
};

payDataBaseService.getById = function (id) {
    return PayDataBase.findOne({
        where: {id: id},
        include: {
            model: FundDataBase,
            attributes: ['id', 'name']
        }
    });
};


payDataBaseService.updateById = function (id, file) {

    return PayDataBase.findOne({
        where: {id: id}
    }).then(function(dbfile){
        return dbfile.update(file);
    });

};


payDataBaseService.deleteById = function (id) {
    return PayDataBase.destroy({
        where: {
            id :id
        }
    })
};

payDataBaseService.deleteByProjectId = function (id) {
    return PayDataBase.destroy({
        where:{
            projectId : id
        }
    });
};


payDataBaseService.getPayByProjectId = function (projectId) {
    return PayDataBase.all({
        where:{
            projectId: projectId
        },
        order: [["createdAt", "DESC"]]
    });
};

payDataBaseService.queryByPage = function(args) {
    var attributes = args.attributes;
    var where = args.where || {};
    var limit = args.limit || 6;
    var offset = args.offset || args.page || 0;
    var order = args.order || ['createdAt'];
    var include = args.include || [{
            model:FundDataBase,
            attributes:['id', 'name']
        }];

    return PayDataBase.findAndCount({
        attributes: attributes,
        where: where,
        offset: offset * limit,
        limit: limit,
        order: order,
        include: include
    })
};