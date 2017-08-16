/**
 * Created by hk60 on 2016/4/18.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  Scene = sequelize.define('Scene', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_s_id',
            comment: '主键'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_s_name',
            comment: '镜头名称'
        },
        shotCode:{
            type: Sequelize.STRING,
            allowNull: true,
            field: 'f_s_shotcode',
            comment: '镜头编号'
        },
        creatorId: {
            type: Sequelize.STRING,
            references:{
                model: 't_userinfo',
                key: 'pk_ui_id'
            },
            field: 'f_s_creatorid',
            comment: '创建人编号'
        },
        projectId: {
            type: Sequelize.STRING,
            references:{
                model: 't_projectinfo',
                key: 'pk_pi_id'
            },
            field: 'f_s_prjid',
            comment: '所属项目ID',
            onDelete: 'CASCADE'
        },
        changId:{
            type: Sequelize.STRING,
            references:{
                model: 't_sceneinfo',
                key: 'pk_si_id'
            },
            allowNull: true,
            field: 'f_s_changid',
            comment: '所属场ID'
        },
        jiId:{
            type: Sequelize.STRING,
            references:{
                model: 't_sceneinfo',
                key: 'pk_si_id'
            },
            allowNull: true,
            field: 'f_s_jiid',
            comment: '所属集ID'
        },
        desc: {
            type: Sequelize.STRING,
            allowNull: true,
            field: 'f_s_desc',
            comment: '镜头描述'
        },
        assetImg:{
            type: Sequelize.TEXT,
            field: 'f_s_assetimg',
            defaultValue: 'defaultShotThumbnail.png',
            comment: '镜头缩略图'
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
        tableName:'t_scene',
        classMethods: {
            associate: function(models) {
                Scene.belongsTo(models.User, {foreignKey: 'f_s_creatorid'});
                Scene.belongsTo(models.Project, {foreignKey: 'f_s_prjid',onDelete: 'CASCADE'});
                Scene.hasMany(models.Task,{foreignKey:'f_ti_associatedshotid'});
                //SceneInfo.hasOne(models.SceneInfo, {foreignKey: 'f_si_type'});
                models.chang = Scene.belongsTo(models.SceneInfo, {foreignKey: 'f_s_changid',as:"chang"});
                models.ji = Scene.belongsTo(models.SceneInfo, {foreignKey: 'f_s_jiid',as:"ji"});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);