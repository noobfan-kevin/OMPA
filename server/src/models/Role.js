/**
 * Created by YanJixian on 2015/11/12.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  Role = sequelize.define('Role', {
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_ri_id',
        comment: '主键'
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'f_ri_name',
        comment: '角色名称'
    },
    type: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        field: 'f_ri_type',
        comment: '类型'
    },
        createdAt:{
            type: Sequelize.DATE,
            field: 'created_at',
            comment: '创建时间'
        },
        updatedAt:{
            type: Sequelize.DATE,
            field: 'updated_at',
            comment: '创建时间'
        }
},
    {
        tableName:'t_roleinfo',
        comment: '角色表',
        classMethods: {
            associate: function(models) {
                Role.hasMany(models.User,  {foreignKey: 'f_ui_roleid'});
                Role.belongsToMany(models.Authority,  {through: models.RoleAuthority, foreignKey: 'f_rai_roleid'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);