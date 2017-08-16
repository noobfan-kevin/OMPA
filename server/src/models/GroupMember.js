/**
 * Created by YanJixian on 2015/11/12.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  GroupMember = sequelize.define('GroupMember', {
    groupId: {
        type: Sequelize.STRING,
        references:{
            model: 't_groupinfo',
            key: 'pk_gi_id'
        },
        field: 'f_gmi_groupid',
        comment: '群编号'
    },
    userId: {
        type: Sequelize.STRING,
        references:{
            model: 't_userinfo',
            key: 'pk_ui_id'
        },
        field: 'f_gmi_userid',
        comment: '用户编号'
    },
    projectId: {
        type: Sequelize.STRING,
        field: 'f_fi_projectid',
        comment: '项目编号'
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
        tableName:'t_groupmemberinfo',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);