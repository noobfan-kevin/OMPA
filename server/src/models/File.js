/**
 * Created by YanJixian on 2015/11/12.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');
var fileUtils = require('../dbUtils/fileUtils');

var File=module.exports = sequelize.define('File', { 
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_fi_id',
        comment: '主键'
    },
    parentIds: {
        type: Sequelize.TEXT,
        field: 'f_fi_parentids',
        comment: '所有上级父ID'
    },
    parentId: {
        type: Sequelize.STRING,
        field: 'f_fi_parentid',
        comment: '父文件ID'
    },
    index: {
        type: Sequelize.STRING,
        field: 'f_fi_indexid',
        comment: '索引'
    },
    projectId: {
        type: Sequelize.STRING,
        references:{
            model: 't_projectinfo',
            key: 'pk_pi_id'
        },
        field: 'f_fi_prjid',
        comment: '对应项目编号'
    },
    originalName: {
        type: Sequelize.STRING,
        field: 'f_fi_originalname',
        comment: '文件原始名称'
    },
    name: {
        type: Sequelize.STRING,
        field: 'f_fi_name',
        comment: '文件存储名称'
    },
    path: {
        type: Sequelize.STRING,
        field: 'f_fi_path',
        comment: '存储路径'
    },
    extension: {
        type: Sequelize.STRING,
        field: 'f_fi_ext',
        comment: '文件扩展名'
    },
    size: {
        type: Sequelize.FLOAT,
        field: 'f_fi_size',
        comment: '文件大小'
    },
    sourceTable: {
        type: Sequelize.STRING,
        field: 'f_fi_sourcetable',
        comment: '来源表的名称'
    },
    sourceKey: {
        type: Sequelize.STRING,
        field: 'f_fi_sourcekey',
        comment: '来源表的主键'
    },
    authorId: {
        type: Sequelize.STRING,
        references:{
            model: 't_userinfo',
            key: 'pk_ui_id'
        },
        field: 'f_fi_authorid',
        comment: '创建人编号,群编号'
    },
    logicPath: {
        type: Sequelize.STRING,
        field: 'f_fi_logicpath',
        comment: '资源管理器的逻辑路径'
    },
    isFolder: {
        type: Sequelize.BOOLEAN,
        field: 'f_fi_isfolder',
        comment: '是否为文件夹'
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
        tableName:'t_fileinfo',
        classMethods: {
            associate: function(models) {
                File.hasMany(models.Progress, {foreignKey: 'f_pi_dirpathid',constraints: false});
                File.hasMany(models.ReviewComment, {foreignKey: 'pk_fi_id',as: 'reviews'});
                File.belongsTo(models.User, {foreignKey: 'f_fi_creatorid', as: 'creator'});
                File.belongsTo(models.Project, {foreignKey: 'f_fi_prjid'});
            }
        },
        hooks: {
            beforeBulkDestroy: function(options) {
               return this.all({
                   where: options.where
               }).then(function(dbFiles) {
                   fileUtils.deleteFromDisk( fileUtils.getPath(dbFiles) );
               })
            },
            beforeDestroy: function(dbFile) {
                fileUtils.deleteFromDisk( fileUtils.getPath(dbFile) );
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);
