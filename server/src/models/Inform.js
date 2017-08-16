/**
 * Created by wangziwei on 2015/11/13.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  Inform = sequelize.define('Inform', {
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_ii_id',
        comment: '编号'
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'f_ii_tilte',
        comment: '通知标题'
    },
    contents: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: 'f_ii_contents',
        comment: '通知内容'
    },
    senderId: {
        type: Sequelize.STRING,
        allowNull: false,
        references:{
            // 这是别的模型的引用
            model: 't_userinfo',
            // 引用的模型的列名
            key: 'pk_ui_id'
        },
        field: 'f_ii_senderid',
        comment: '发送人编号'
    },
    projectId: {
        type: Sequelize.STRING,
        allowNull: false,
        references:{
            // 这是别的模型的引用
            model: 't_projectinfo',
            // 引用的模型的列名
            key: 'pk_pi_id'
        },
        field: 'f_ii_prjid',
        comment: '所属项目编号'
    },
    receivers: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        field: 'f_ii_receiverid',
        comment: '接收人所属模块列表JSON：{id:userId, isRead: false}'
    },
    attachmentId: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        field: 'f_ii_attachmentid',
        comment: '附件编号'
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
},{
    tableName:'t_informinfo',
    classMethods: {
        associate: function(models) {
            Inform.belongsTo(models.User, {foreignKey: 'f_ii_senderid', as: 'sender'});
            Inform.belongsTo(models.Project, {foreignKey: 'f_ii_prjid'});
        }
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
