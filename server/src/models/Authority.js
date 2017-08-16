/**
 * Created by YanJixian on 2015/11/12.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  Authority = sequelize.define('Authority', {
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_ai_id',
        comment: '主键'
    },
    name: {
        type: Sequelize.STRING,
        field: 'f_ai_name',
        comment: '权限名称'
    },
    desc: {
        type: Sequelize.TEXT,
        field: 'f_ai_desc',
        comment: '操作描述'
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
        tableName:'t_authorityinfo',
        classMethods: {
            associate: function(models) {
                Authority.belongsToMany(models.Role,  {through: models.RoleAuthority, foreignKey: 'f_rai_authorityid'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);