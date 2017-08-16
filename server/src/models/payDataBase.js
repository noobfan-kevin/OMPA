/**
 * Created by HeLiang on 2016/7/6.
 */
var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  PayDataBase  = sequelize.define('PayDataBase',{
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_pdb_id',
        comment: '主键'
    },
    typeId:{
        type: Sequelize.STRING,
        allowNull: true,
        field: 'f_pdb_typeid',
        references:{
            // 这是别的模型的引用
            model: 't_fundinfo',
            // 引用的模型的列名
            key: 'pk_fi_id'
        },
        comment: '类别id',
        onDelete:'CASCADE'
    },
    projectId: {
        type: Sequelize.STRING,
        field: 'f_pdb_prjid',
        comment: '对应项目编号'
    },
    amount: {
        type: Sequelize.FLOAT,
        field: 'f_pdb_amount',
        comment: '金额'
    },
    username: {
        type: Sequelize.STRING,
        field: 'f_pdb_username',
        comment: '使用人/物'
    },
    remark: {
        type: Sequelize.TEXT,
        field: 'f_pdb_remark',
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
    tableName:'t_payinfo',
    classMethods: {
        associate: function(models) {
            PayDataBase.belongsTo(models.FundDataBase, {foreignKey: 'f_pdb_typeid', onDelete:'CASCADE'});
        }
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
