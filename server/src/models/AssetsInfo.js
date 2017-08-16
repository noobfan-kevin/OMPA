/**
 * Created by hk053 on 2016/3/28.
 */


var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  AssetsInfo = sequelize.define('AssetsInfo', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_ai_id',
            comment: '主键'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ai_name',
            comment: '资产名称'
        },
        type:{
            type: Sequelize.STRING,
            references:{
                model: 't_assetstype',
                key: 'pk_at_id'
            },
            allowNull: false,
            field: 'f_ai_type',
            comment: '资产类型'
        },
        creatorId: {
            type: Sequelize.STRING,
            references:{
                model: 't_userinfo',
                key: 'pk_ui_id'
            },
            field: 'f_ai_creatorid',
            comment: '创建人编号'
        },
        projectId: {
            type: Sequelize.STRING,
            references:{
                model: 't_projectinfo',
                key: 'pk_pi_id'
            },
            field: 'f_ai_prjid',
            comment: '所属项目ID',
            onDelete: 'CASCADE'
        },
        desc: {
            type: Sequelize.STRING,
            allowNull: true,
            field: 'f_ai_desc',
            comment: '资产描述'
        },
        assetImg:{
            type: Sequelize.TEXT,
            field: 'f_ai_assetimg',
            defaultValue: 'defaultAssetThumbnail.png',
            comment: '资产头像'
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
        tableName:'t_assetsinfo',
        classMethods: {
            associate: function(models) {
                AssetsInfo.belongsTo(models.User, {foreignKey: 'f_ai_creatorid'});
                AssetsInfo.belongsTo(models.Project, {foreignKey: 'f_ai_prjid', onDelete:'CASCADE'});
                AssetsInfo.belongsTo(models.AssetsType, {foreignKey: 'f_ai_type'});
                AssetsInfo.hasMany(models.Task,{foreignKey:'f_ti_associatedassetid'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);