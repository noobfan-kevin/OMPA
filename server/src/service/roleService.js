/**
 * Created by YanJixian on 2015/11/19.
 */

var Role = process.core.db.models.Role;
var Authority = process.core.db.models.Authority;
var log = process.core.log;
var User = process.core.db.models.User;

var roleService = module.exports;

var currentCount= 0;

// 增
roleService.create = function (role) {
    return Role.create(role);
};

// 删
roleService.deleteById = function (id) {
    return roleService.getById(id).then(function (dbRole) {
        //console.log(dbRole);
        return dbRole.destroy();
    });
};
// 改
roleService.updateById = function (id, role) {
    return roleService.getById(id).then(function (dbRole) {
        return dbRole.update(role);
    });
};

// 查
roleService.getById = function (id) {
    return Role.findById(id);
};

/**
 *
 * @param where
 * @param role
 * @returns {Promise.<Instance, created>} .spread((function(role, created){})
 */
roleService.findOrCreate = function (where , role) {
    return Role.findOrCreate({where: where, defaults: role});
};

roleService.createOneByOne= function(roles, callback){
    var len = roles.length;
    currentCount= 0;
    for(var i=0; i<len; i++){
        setTimeout(function(i){
            Role.create(roles[i]).then(function(){
                currentCount++;
                if(currentCount===roles.length)
                {
                    callback&& callback();
                }
            });
        }, 10*i, i);
    }
};

// 批量创建
roleService.createAll = function (roles) {

    return Role.bulkCreate(roles);
    //return result;
    //for(var i = 0,len = roles.length; i<len; i++){
    //    Role.create(roles[i]);
    //}

};

/**
 *
 * @param args attributes:查询字段,where:查询条件,offset:跳过数据条数,limit:查询数据条数,order:排序,include:关联
 * 参考：http://note.youdao.com/groupshare/?token=1851646F75074E9C88180593AD747223&gid=11001280
 * @returns promise
 */

roleService.query = function (args) {
    return Role.all(args);
};


roleService.roleTotal = function (where) {
    return Role.count(where);
};



roleService.userWheatherHasAuthority= function(userId, authorityString){
    return User.findOne({where:{id:userId}, include:[{model:Role,include:[Authority]}]}).then(function(userData){
        if(userData){
            var authority=userData.Role.Authorities.map(function(oneElem){
                return oneElem.getDataValue('name');
            });
            authority= authority.join(';');
            if(authority.indexOf(authorityString)>=0)
            {
                return true;
            }
            return false;
        }
        return false;
    });
};