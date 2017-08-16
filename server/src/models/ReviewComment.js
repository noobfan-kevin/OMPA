/**
 * Created by wangziwei on 2015/11/13.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  ReviewComment = sequelize.define('ReviewComment', {
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_rci_id',
        comment: '编号'
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: 'f_rci_content',
        comment: '审核意见'
    },
    taskVersionId:{
        type: Sequelize.STRING,
        allowNull: true,
        references:{
            // 这是别的模型的引用
            model: 't_taskversioninfo',
            // 引用的模型的列名
            key: 'pk_tvi_id'
        },
        field: 'f_rci_taskversionid',
        comment: '所属版本Id'
    },
    progressId:{
        type: Sequelize.STRING,
        allowNull: true,
        references:{
            // 这是别的模型的引用
            model: 't_progressinfo',
            // 引用的模型的列名
            key: 'pk_pi_id'
        },
        field: 'f_rci_progressid',
        comment: '所属进程Id',
        onDelete: 'CASCADE'
    },
    senderId: {
        type: Sequelize.STRING,
        allowNull: false,
        references:{
            model: 't_userinfo',
            key: 'pk_ui_id'
        },
        field: 'f_rci_senderid',
        comment: '发送人编号'
    },
    fileId: {
        type: Sequelize.STRING,
        allowNull: true,
        references:{
            // 这是别的模型的引用
            model: 't_fileinfo',
            // 引用的模型的列名
            key: 'pk_fi_id'
        },
        field: 'f_rci_fileid',
        comment: '上传文件ID'
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
    tableName:'t_reviewcommentinfo',
    classMethods: {
        associate: function(models) {
            ReviewComment.belongsTo(models.User, {foreignKey: 'f_rci_senderid',as:'sender'});
            ReviewComment.belongsTo(models.Progress,{foreignKey:'f_rci_progressid',as:'belongProgress'});
            ReviewComment.belongsTo(models.File,{foreignKey:'f_rci_fileid',as:'belongFile'});
            ReviewComment.belongsTo(models.TaskVersion, {foreignKey: 'f_rci_taskversionid'});
        }
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
