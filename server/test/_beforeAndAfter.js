/**
 * Created by yang on 15/1/26.
 */
var utils = require('./utils');
var Server = utils.getServer();

//require('blanket')({
//    //pattern: function (filename) {
//    //    return !/node_modules/.test(filename);
//    //}
//});

before('初始化系统', function(){

    //初始化core模块，方便使用schema文件

    return (new Server()).connectDB().catch(function (err) {
        console.log(err.stack);
    });

});


//after('关闭数据库', function(done){
//
//    process.core.db.conn.close().then(done);
//
//});