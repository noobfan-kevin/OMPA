/**
 * Created by hk61 on 2016/5/13.
 */

var fs = require('fs');
var path = require('path');
var config = process.core.config;

var fileUtils = module.exports;

/*
* 从磁盘中删除文件
* @Param {ARRAY || STRING} path 字符串形式的完整路径，路径数组
* */
fileUtils.deleteFromDisk = function(path) {

    path = Array.isArray(path) ? path : [path];

    path.map(function(p) {
        fs.unlink(p, function(status) {
            if(!status){
                console.log('从磁盘删除文件成功！');
            }else{
                console.error(status.message);
            }
        } );
    });

};


/*
 * 从数据库中筛选出路径
 * @Param {DBDATA} dbFiles 从FileModel获取到的内容
 * */
fileUtils.getPath = function(dbFiles) {


    if(!dbFiles || dbFiles.length === 0 ) return [];
    if(!Array.isArray(dbFiles)) return [dbFiles.getDataValue('path')];   // 单个实例

    return dbFiles.map(function(dbFile) {
        return dbFile.getDataValue('path');
    });

};