/**
 * Created by HeLiang on 2016/6/13.
 */
var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  FundDataBase  = sequelize.define('FundDataBase',{
    id: {
        type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_fi_id',
            comment: '主键'
    },
    name:{
        type: Sequelize.STRING,
            allowNull: false,
            field: 'f_fi_name',
            comment: '类别名称'
    },
    isFund:{
        type: Sequelize.BOOLEAN,
        field: 'f_fi_isfund',
        comment: '是否为资金'
    },
    parentId: {
        type: Sequelize.STRING,
        field: 'f_fi_parentid',
        comment:'上级类别编号',
        references:{
            // 这是别的模型的引用
            model: 't_fundinfo',
            // 引用的模型的列名
            key: 'pk_fi_id'
        },
        allowNull: true,
        onDelete:'CASCADE'
    },
    projectId: {
        type: Sequelize.STRING,
        field: 'f_fi_prjid',
        comment: '对应项目编号'
    },
    amount: {
        type: Sequelize.FLOAT,
            field: 'f_fi_amount',
            comment: '金额'
    },
    remark: {
        type: Sequelize.INTEGER,
        field: 'f_fi_remark',
        comment: '备注'
    },
    createdAt:{
        type: Sequelize.DATE,
            field: 'created_at',
            comment: '创建时间'
    },
    updatedAt:{
        type: Sequelize.DATE,
            field: 'updated_at',
            comment: '更新时间'
    }
},{
    tableName:'t_fundinfo',
        classMethods: {
        associate: function(models) {
            FundDataBase.hasMany(models.User, {foreignKey: 'f_ui_fundid'});

        }
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
