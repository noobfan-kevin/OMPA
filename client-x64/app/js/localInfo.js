/**
 * Created by Congzhou on 2016/3/21. 非独立js，依赖于login.html
 */

var LocalInfoManager= function(){

    var fs = require('fs');
    var path = require("path");
    var userpath=path.dirname(process.execPath);

    //读取package.json配置信息
    var packageInfo = require(userpath+"/package.json");
    localStorage.setItem('bDebug', packageInfo.window.toolbar);

    return{
        writeUserInfoFile: function(){
            fs.writeFile(userpath+"/userinfo", JSON.stringify(LocalInfo),"utf-8", function(err){
                if(err)
                {
                    console.log('写入文件失败');
                }
                else
                {
                    console.log('写入文件成功');
                }
            });
        },
        readUserInfoFile: function(){
            fs.readFile(userpath+"/userinfo",'utf-8', function(err, data){
                LocalInfo= new Object();
                if(err)
                {
                    console.log('读取文件失败');
                }
                else
                {
                    try
                    {
                        LocalInfo=JSON.parse(data);
                    }
                    catch (e)
                    {
                        console.log('userinfo文件内容无效');
                    }

                }
            });
        }
    }
}();

LocalInfoManager.readUserInfoFile();