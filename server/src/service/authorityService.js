/**
 * Created by YanJixian on 2015/11/19.
 */

var Authority = process.core.db.models.Authority;
var log = process.core.log;

var authorityService = module.exports;


// 增
authorityService.create = function (authority) {
    return Authority.create(authority);
};

// 删
authorityService.deleteById = function (id) {
    return authorityService.getById(id).then(function (dbAuthority) {
        return dbAuthority.destroy();
    });
};

// 改
authorityService.updateById = function (id, authority) {
    return authorityService.getById(id).then(function (dbAuthority) {
        return dbAuthority.update(authority);
    });
};

// 查
authorityService.getById = function (id) {
    return Authority.getById(id);
};



// 批量创建
authorityService.createAll = function (Authorities) {
    return Authority.bulkCreate(Authorities);
};


/**
 *
 * @param args attributes:查询字段,where:查询条件,offset:跳过数据条数,limit:查询数据条数,order:排序,include:关联
 * 参考：http://note.youdao.com/groupshare/?token=1851646F75074E9C88180593AD747223&gid=11001280
 * @returns promise
 */
authorityService.query = function (args) {
    if (!args) {
        args = {};
    }
    var attributes = args.attributes;
    var where = args.where || {};
    var offset = args.offset || 0;
    var limit = args.limit;
    var order = args.order || '';
    //var include = args.include || [{all: true}];
    return Authority.all(
        {
            attributes: attributes,
            where: where,
            offset: offset,
            limit: limit,
            order: order,
            //include: include
        }
    );
};

authorityService.authorityTotal = function (where) {
    return Authority.count(where);
};