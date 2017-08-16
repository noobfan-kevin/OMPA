/**
 * Created by YanJixian on 2015/11/12.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');
var utils = require('../core/utils');

module.exports =  Credit = sequelize.define('Credit', {
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_cd_id',
        comment: '主键'
    },
    projectId: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'f_cd_projid',
        comment: '所属项目ID'
    },
    scores: {
        type: Sequelize.FLOAT,
        allowNull: false,
        field: 'f_cd_scores',
        comment: '任务积分'
    },
    name: {
        type: Sequelize.STRING,
        field: 'f_cd_name',
        comment: '积分名称'
    },
    progressId: {
        type: Sequelize.STRING,
        references:{
            // 这是别的模型的引用
            model: 't_progressinfo',
            // 引用的模型的列名
            key: 'pk_pi_id'
        },
        allowNull: false,
        field: 'f_cd_prgid',
        comment: '进程编号'
    },
    userId: {
        type: Sequelize.STRING,
        references:{
            // 这是别的模型的引用
            model: 't_userinfo',
            // 引用的模型的列名
            key: 'pk_ui_id'
        },
        field: 'f_cd_userid',
        comment: '用户编号'
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
        tableName:'t_creditdetail',
        comment: '积分表',
        classMethods: {
            associate: function(models) {
                Credit.belongsTo(models.Progress, {foreignKey: 'f_cd_prgid'});
                Credit.belongsTo(models.User, {foreignKey: 'f_cd_userid'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);