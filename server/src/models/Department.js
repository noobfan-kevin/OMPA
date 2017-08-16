/**
 * Created by wangziwei on 2015/11/12.
 */
var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');


module.exports =  Department = sequelize.define('Department', {
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_di_id',
        comment: '主键'
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'f_di_name',
        comment: '部门名称'
    },
    fatherId: {
        type: Sequelize.STRING,
        references:{
            // 这是别的模型的引用
            model: 't_departmentinfo',
            // 引用的模型的列名
            key: 'pk_di_id'
        },
        field: 'f_di_fatherid',
        comment: '上级部门编号'
    },
    desc: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'f_di_desc',
        comment: '部门描述'
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
    tableName:'t_departmentinfo',
    classMethods: {
        associate: function(models) {
            Department.hasMany(models.User, {foreignKey: 'f_ui_departmentid'});
            Department.hasMany(models.NoticeLine, {foreignKey: 'f_nli_departmentid',as:'belongDepart'});
            models.Father = Department.belongsTo(Department, {foreignKey: 'f_di_fatherid', as: 'father'});
        }
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});