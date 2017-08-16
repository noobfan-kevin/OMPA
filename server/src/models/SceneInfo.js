/**
 * Created by hk053 on 2016/3/28.
 */


var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  SceneInfo = sequelize.define('SceneInfo', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_si_id',
            comment: '主键'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_si_name',
            comment: '镜头名称'
        },
        projectId: {
            type: Sequelize.STRING,
            references:{
                model: 't_projectinfo',
                key: 'pk_pi_id'
            },
            field: 'f_si_prjid',
            comment: '所属项目ID',
            onDelete: 'CASCADE'
        },
        fatherId:{
            type: Sequelize.STRING,
            references:{
                model: 't_sceneinfo',
                key: 'pk_si_id'
            },
            allowNull: true,
            field: 'f_si_fatherid',
            comment: '父级模块ID'
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
        tableName:'t_sceneinfo',
        classMethods: {
            associate: function(models) {
                SceneInfo.belongsTo(models.Project, {foreignKey: 'f_si_prjid', onDelete: 'CASCADE'});
                //SceneInfo.hasOne(models.SceneInfo, {foreignKey: 'f_si_type'});
                models.sceneTreeFather = SceneInfo.belongsTo(SceneInfo, {foreignKey: 'f_si_fatherid', as: 'father'});
                models.sceneTreeChildren = SceneInfo.hasMany(SceneInfo,{foreignKey: 'f_si_fatherid', as: 'children'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);