/**
 * Created by hk61 on 2016/3/10.
 */
var Role = process.core.db.models.Role;
var Authority = process.core.db.models.Authority;
var RoleAuthority = process.core.db.models.RoleAuthority;
var log = process.core.log;

roleAuthorityService = module.exports;


/*Role.belongsToMany(Authority,  {through: RoleAuthority, foreignKey: 'F_RAI_RoleId'});
Authority.belongsToMany(Role,  {through: RoleAuthority, foreignKey: 'F_RAI_AuthorityId'});*/


roleAuthorityService.init = function(DefaultRoles){

    var roles= DefaultRoles.map(function(role) {
        if (role.defaultAuthorities == void 0) return Promise.resolve(false);
        
        return Role.findAll({
            where:{
                name: role.name
            }
        }).then(function(dbRole) {
            return Authority.findAll({
                where: {
                    name: role.defaultAuthorities
                }
            }).then(function(authorities) {
                dbRole[0].addAuthorities(authorities);
            });
        });
        
    });

    return Promise.all(roles);

};

roleAuthorityService.createUserAuthority = function(role,authorityIds) {
    return Role.create(role).then(function(role) {
        return Authority.findAll({
            where: {
                id:authorityIds
            }
        }).then(function(authorities){
            role.addAuthorities(authorities);
            return role;   //改了！ 返回必须有角色ID
        });
    });

};

roleAuthorityService.updateUserAuthority = function(roleEdit,authorityIds) {

    return Role.findById(roleEdit.id).then(function(role) {
        role.update({
            name:roleEdit.name
        });
        return Authority.findAll({
            where: {
                id:authorityIds
            }
        }).then(function(authorities){
            return role.setAuthorities(authorities);
        });
    });

};




