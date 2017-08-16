/**
 * Created by hk053 on 2016/7/19.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports  = Notice = sequelize.define('Notice', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_ni_id',
            comment: '主键'
        },
        sendUserId:{
            type: Sequelize.STRING,
            field: 'f_ni_senduserid',
            comment: '发送人的Id',
            onDelete: 'CASCADE'
        },
        sendUserName:{
            type: Sequelize.STRING,
            field: 'f_ni_sendusername',
            comment: '发送人名字'
        },
        noticeInfo:{
            type: Sequelize.TEXT,
            field: 'f_ni_noticeinfo',
            comment: '通知内容'
        },
        noticetitle:{
            type: Sequelize.STRING,
            field: 'f_ni_noticetitle',
            comment: '通知标题'
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
        tableName:'t_noticeinfo',
        classMethods: {
            associate: function(models) {
                Notice.hasMany(models.NoticeLine, {foreignKey: 'f_nli_noticeid', onDelete:'CASCADE'});
                Notice.hasMany(models.UserReadNotice, {foreignKey: 'f_uri_noticeid', onDelete:'CASCADE'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);