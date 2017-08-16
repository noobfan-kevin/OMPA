/**
 * Created by YanJixian on 2015/11/12.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  Chat = sequelize.define('Chat', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_ci_id',
            comment: '主键'
        },
        senderId: {
            type: Sequelize.UUID,
            allowNull: false,
            references:{
                model: 't_userinfo',
                key: 'pk_ui_id'
            },
            field: 'f_ci_senderid',
            comment: '发送人编号'
        },
        receiverId: {
            type: Sequelize.UUID,
            allowNull: false,
            references:{
                model: 't_userinfo',
                key: 'pk_ui_id'
            },
            field: 'f_ci_receiverid',
            comment: '接收人编号'
        },
        type: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'f_ci_type',
            comment: '接收类型,0：个人聊天；1：群聊'
        },
        category: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'f_ci_category',
            comment: '类别,1:文本; 2:链接'
        },
        message: {
            type: Sequelize.TEXT,
            allowNull: false,
            field: 'f_ci_msg',
            comment: '聊天内容'
        },
        projectId: {
            type: Sequelize.UUID,
            references:{
                model: 't_projectinfo',
                key: 'pk_pi_id'
            },
            field: 'f_ci_prjid',
            comment: '对应项目编号'
        },
        sendTime: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'f_ci_sendtime',
            defaultValue: Sequelize.NOW,
            comment: '发送时间'
        },
        attachmentAmount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'f_ci_attachmentamount',
            comment: '附件数量，备用'
        },
        schemeId: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ci_schemeid',
            comment: '备用'
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
        tableName:'t_chatinfo',
        classMethods: {
            associate: function(models) {
                Chat.belongsTo(models.User, {foreignKey: 'f_ci_senderid', as: 'sender',constraints:false});
                Chat.belongsTo(models.User, {foreignKey: 'f_ci_receiverid', as: 'receiver'});
                Chat.belongsTo(models.Project, {foreignKey: 'f_ci_prjid'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);