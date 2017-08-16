/**
 * Created by YanJixian on 2015/11/12.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  RoleAuthority = sequelize.define('RoleAuthority', {

    roleId: {
        type: Sequelize.STRING,
        allowNull: true,
        references:{
            model: 't_roleinfo',
            key: 'pk_ri_id'
        },
        field: 'f_rai_roleid',
        comment: '角色编号'
    },
    authorityId: {
        type: Sequelize.STRING,
        allowNull: true,
        references:{
            model: 't_authorityinfo',
            key: 'pk_ai_id'
        },
        field: 'f_rai_authorityid',
        comment: '权限编号'
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
        tableName:'t_roleauthorityinfo',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);