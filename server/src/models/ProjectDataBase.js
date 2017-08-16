/**
 * Created by HK059 on 2016/4/18.
 */
var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

var ProjectDataBase=module.exports = sequelize.define('ProjectDataBase', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_pi_id',
            comment: '主键'
        },
        parentIds: {
            type: Sequelize.TEXT,
            field: 'f_pi_parentids',
            comment: '所有上级父ID'
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
        projectId: {
            type: Sequelize.STRING,
            references:{
                model: 't_projectinfo',
                key: 'pk_pi_id'
            },
            field: 'f_pi_prjid',
            comment: '对应项目编号'
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
        path: {
            type: Sequelize.TEXT,
            field: 'f_pi_path',
            comment: '文件存储路径'
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
        sourceKey: {
            type: Sequelize.STRING,
            field: 'f_pi_sourcekey',
            comment: '来源表的主键'
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
        type: {
            type: Sequelize.STRING,
            references:{
                model: 't_filetype',
                key: 'pk_ft_id'
            },
            field: 'f_pi_type',
            comment: '文件类型'
        },
        title: {
            type: Sequelize.TEXT,
            field: 'f_pi_title',
            comment: '文件标签名'
        },
        description: {
            type: Sequelize.TEXT,
            field: 'f_pi_description',
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
        tableName:'t_projectdatabaseinfo',
        classMethods: {
            associate: function(models) {
                ProjectDataBase.hasMany(models.Progress, {foreignKey: 'f_pi_dirpathid',constraints: false});
                ProjectDataBase.belongsTo(models.User, {foreignKey: 'f_pi_creatorid', as: 'creator'});
                ProjectDataBase.belongsTo(models.Project, {foreignKey: 'f_pi_prjid'});
                ProjectDataBase.belongsTo(models.FileType, {foreignKey: 'f_pi_type'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);
