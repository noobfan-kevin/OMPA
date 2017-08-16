/**
 * Created by wangziwei on 2015/11/13.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  MessageStatus = sequelize.define('MessageStatus', {
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_msi_id',
        comment: '编号'
    },
    senderId: {
        type: Sequelize.STRING,
        field: 'f_msi_senderid',
        comment: '发送人编号'
    },
    receiverId: {
        type: Sequelize.STRING,
        references:{
            // 这是别的模型的引用
            model: 't_userinfo',
            // 引用的模型的列名
            key: 'pk_ui_id'
        },
        field: 'f_msi_receiverid',
        comment: '接收人编号'
    },
    groupId: {
        type: Sequelize.STRING,
        references:{
            // 这是别的模型的引用
            model: 't_groupinfo',
            // 引用的模型的列名
            key: 'pk_gi_id'
        },
        field: 'f_msi_groupid',
        comment: '群组编号'
    },
    type: {
        type: Sequelize.INTEGER,
        field: 'f_msi_type',
        comment: '接收类型 0:未接收1：已接收'
    },
    time: {
        type: Sequelize.DATE,
        defaultValue:Sequelize.NOW,
        field: 'f_msi_time',
        comment: '关闭窗口时间'
    },
    chatTime: {
        type: Sequelize.DATE,
        defaultValue:Sequelize.NOW,
        field: 'f_msi_chattime',
        comment: '聊天时间'
    },
    projectId: {
        type: Sequelize.STRING,
        references:{
            // 这是别的模型的引用
            model: 't_projectinfo',
            // 引用的模型的列名
            key: 'pk_pi_id'
        },
        field: 'f_msi_prjid',
        comment: '所属项目编号'
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
    tableName:'t_messagestatusinfo',
    classMethods: {
        associate: function(models) {
            MessageStatus.belongsTo(models.User, {foreignKey: 'f_msi_senderid', as: 'sender',constraints:false});
            MessageStatus.belongsTo(models.User, {foreignKey: 'f_msi_receiverid', as: 'receiver'});
            MessageStatus.belongsTo(models.Project, {foreignKey: 'f_msi_prjid'});
            MessageStatus.belongsTo(models.Group, {foreignKey: 'f_msi_groupid'});

        }
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
