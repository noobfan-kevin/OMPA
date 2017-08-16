/**
 * Created by hk61 on 2016/7/4.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports = Log = sequelize.define('Log', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_li_id',
            comment: '主键'
        },
        userId: {
            type: Sequelize.STRING,
            allowNull: false,
            references:{
                // 这是别的模型的引用
                model: 't_userinfo',
                // 引用的模型的列名
                key: 'pk_ui_id'
            },
            field: 'f_li_userid',
            comment: '操作人id'
        },
        userName: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_li_username',
            comment: '操作人'
        },
        time:{
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
            field: 'f_li_time',
            comment: '操作时间'
        },
        type: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'f_li_type',
            comment: '0：其它;1: 任务；2：合同；'
        },
        typeId: {
            type: Sequelize.STRING,
            allowNull: true,
            field: 'f_li_typeid',
            comment: '类型对应表的id'
        },
        projectId: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_li_projectid',
            comment: '项目id'
        },
        ip: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_li_ip',
            comment: '操作人ip'
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            field: 'f_li_description',
            comment: '操作描述'
        }
    },
    {
        tableName:'t_loginfo',
        classMethods: {
            associate: function(models) {
                Log.belongsTo(models.User, {foreignKey: 'f_li_userid', onDelete:'SET NULL'});
            }
        },
        timestamps: false
    }
);