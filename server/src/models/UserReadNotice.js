/**
 * Created by hk053 on 2016/7/20.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports  = UserReadNotice = sequelize.define('UserReadNotice', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_uri_id',
            comment: '主键'
        },
        readUserId:{
            type: Sequelize.STRING,
            field: 'f_uri_readuserid',
            comment: '已读人员'
        },
        noticeId:{
            type: Sequelize.STRING,
            references:{
                model: 't_noticeinfo',
                key: 'pk_ni_id'
            },
            field: 'f_uri_noticeid',
            comment: '通知id'
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
        tableName:'t_userreadnoticeinfo',
        classMethods: {
            associate: function(models) {
                UserReadNotice.belongsTo(models.Notice, {foreignKey: 'f_uri_noticeid'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);