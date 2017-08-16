/**
 * Created by YanJixian on 2015/11/12.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

    module.exports =  Group = sequelize.define('Group', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_gi_id',
        comment: '主键'
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'f_gi_name',
        comment: '群组名称'
    },
    creatorId: {
        type: Sequelize.UUID,
        references:{
            // 这是别的模型的引用
            model: 't_userinfo',
            // 引用的模型的列名
            key: 'pk_ui_id'
        },
        allowNull: false,
        field: 'f_gi_creatorid',
        comment: '创建人编号'
    },
    projectId: {
        type: Sequelize.UUID,
        // allowNull: false,
        references:{
            model: 't_projectinfo',
            key: 'pk_pi_id'
        },
        field: 'f_gi_prjid',
        comment: '对应项目编号'
    },
    image: {
        type: Sequelize.STRING,
        field: 'f_gi_groupimage',
        comment: '群图标'
    },
    attachmentAmount: {
        type: Sequelize.INTEGER,
        field: 'f_gi_attachmentamount',
        comment: '群文件数量'
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
        tableName:'t_groupinfo',
        classMethods: {
            associate: function(models) {
                Group.belongsTo(models.User, {foreignKey: 'f_gi_creatorid', as: 'creator'});
                Group.belongsToMany(models.User,  {through: models.GroupMember, foreignKey: 'f_gmi_groupid'});
                Group.belongsTo(models.Project, {foreignKey: 'f_gi_prjid'});
                Group.hasMany(models.MessageStatus, {foreignKey: 'f_msi_groupid'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);