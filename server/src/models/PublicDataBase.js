/**
 * Created by HK059 on 2016/6/14.
 */
var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

var PublicDataBase=module.exports = sequelize.define('PublicDataBase', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_pi_id',
            comment: '主键'
        },
        parentId: {
            type: Sequelize.STRING,
            field: 'f_pi_parentid',
            comment: '父文件ID'
        },
        index: {
            type: Sequelize.STRING,
            field: 'f_pi_indexid',
            comment: '索引'
        },
        originalName: {
            type: Sequelize.STRING,
            field: 'f_pi_originalname',
            comment: '文件原始名称'
        },
        originalNames: {
            type: Sequelize.TEXT,
            field: 'f_pi_originalnames',
            comment: '所有父级文件原始名称'
        },
        extension: {
            type: Sequelize.STRING,
            field: 'f_pi_ext',
            comment: '文件扩展名'
        },
        size: {
            type: Sequelize.FLOAT,
            field: 'f_pi_size',
            comment: '文件大小'
        },
        creatorId: {
            type: Sequelize.STRING,
            references:{
                model: 't_userinfo',
                key: 'pk_ui_id'
            },
            field: 'f_pi_creatorid',
            comment: '创建人编号,群编号'
        },
        isFolder: {
            type: Sequelize.BOOLEAN,
            field: 'f_pi_isfolder',
            comment: '是否为文件夹'
        },
        fileCount: {
            type: Sequelize.INTEGER,
            field: 'f_pi_filecount',
            comment: '文件个数'
        },
        title: {
            type: Sequelize.TEXT,
            field: 'f_pi_title',
            comment: '文件标签名'
        },
        superiorNode: {
            type: Sequelize.STRING,
            field: 'f_pi_superiornode',
            comment: '上级节点'
        },
        subordinateNode: {
            type: Sequelize.TEXT,
            field: 'f_pi_subordinatenode',
            comment: '下级节点'
        },
        attachmentName: {
            type: Sequelize.TEXT,
            field: 'f_pi_attachmentname',
            comment: '附件名称'
        },
        indexKey: {
            type: Sequelize.TEXT,
            field: 'f_pi_indexkey',
            comment: '文件描述'
        },
        imgPath: {
            type: Sequelize.STRING,
            field: 'f_pi_imgpath',
            comment: '缩略图存储路径'
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
        tableName:'t_publicdatabaseinfo',
        classMethods: {
            associate: function(models) {
                PublicDataBase.belongsTo(models.User, {foreignKey: 'f_pi_creatorid', as: 'creator'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);
