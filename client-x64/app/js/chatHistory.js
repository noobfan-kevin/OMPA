/**
 * Created by 安李恩 on 2015/9/9.
 * 使用sqlLite数据库存储聊天记录
 */
(function($,require,exports){
		var path,
		    record_path,
		    fs = require("fs"),
            file,
            sqlite3,
            db,
            pageRowsCount= 5,
            userInfo = JSON.parse(localStorage.getItem('userInfo'));

    function init(){
		path = require("path");
		record_path=path.dirname(process.execPath);
		record_path=record_path+"/record";
		file = record_path+"/" + userInfo.id;//一个登陆用户创建一个数据库，需要改进
        exists = fs.existsSync(file);
        sqlite3 = require("sqlite3").verbose();
        if(!exists){
			fileope.createDbfile(userInfo.id);
			fs.openSync(file, "w");
		}
        db = new sqlite3.Database(file);
        db.serialize(function () {
            db.run("CREATE TABLE if not exists groupChat(id VARCHAR(32) primary key,groupId VARCHAR(32),sender VARCHAR(32),message VARCHAR(0),infoDate DATE,infoType CHAR(2));", function (err, row) {
                if (err) {
                    console.log("创建表时的问题"+err);
                }
            });
            db.run("CREATE TABLE if not exists personageChat(id VARCHAR(32) primary key,sender VARCHAR(32),receive VARCHAR(32),  message VARCHAR(0),infoDate DATE,infoType CHAR(2));", function (err, row) {
                if (err) {
                    console.log("创建表时的问题"+err);
                }
            });
            db.run("CREATE TABLE if not exists userConfig(userId VARCHAR(32),mainKey VARCHAR(32) primary key,mainValue VARCHAR(32));", function (err, row) {
                if (err) {
                    console.log("创建表时的问题"+err);
                }
            });
        });
    }
    //增加一条数据
    function addPersonalChat(sender,receive, message, date,infoType) {
        var id = getGuid(),
            date_time = new Date(date).getTime() || new Date().getTime();
        db.serialize(function () {//与或语句
            db.all("select count(*) as count from personageChat where infoDate = '" + date_time + "'", function (err, row) {
                if (err) {
                    console.log(err);
                } else {
                    if (!row[0]["count"]) {
                        db.run("INSERT INTO personageChat (id,sender,receive,message,infoDate,infoType) VALUES (?,?,?,?,?,?);",
                            [id, sender, receive, message, date_time, infoType || '1'], function (error) {
                                if (error) {
                                    console.log("添加数据时出错：" + error);
                                }
                            });
                    }
                }
            })
        });
        return id;
    }

    //群组增加数据
    function addGroupChat(groupId,sender,message,date,infoType) {
        var id = getGuid(),
            date_time = new Date(date).getTime() || new Date().getTime();

        db.serialize(function () {//与或语句
            db.all("select count(*) as count from groupChat where infoDate = '" + date_time + "'", function (err, row) {
                if (err) {
                    console.log(err);
                } else {
                    if (!row[0]["count"]) {
                        db.run("INSERT INTO groupChat (id,groupId,sender,message,infoDate,infoType) VALUES (?,?,?,?,?,?);",
                            [id, groupId, sender, message, date_time, infoType || '1'], function (error) {
                                if (error) {
                                    console.log("添加数据时出错：" + error);
                                }
                            });
                    }
                }
            })
        });
        return id;
    }

    //增加一条配置数据
    function addUserConfig(mainKey,mainValue) {
        db.serialize(function () {//与或语句userId VARCHAR(32),mainKey VARCHAR(32) primary key,mainValue VARCHAR(32)
            db.all("select count(*) as count from userConfig where mainKey = '" + mainKey + "'", function (err, row) {
                if (err) {
                    console.log(err);
                } else {
                    if (!row[0]["count"]) {
                        db.run("INSERT INTO userConfig (mainKey,mainValue) VALUES (?,?);",
                            [mainKey, mainValue || 0], function (error) {
                                if (error) {
                                    console.log("添加数据时出错：" + error);
                                }
                            });
                    } else {
                        db.run("UPDATE userConfig  SET mainValue =?  WHERE mainKey = ?;",
                            [mainValue,mainKey], function (error) {
                                if (error) {
                                    console.log("添加数据时出错：" + error);
                                }
                            });
                    }
                }
            })
        });
    }
    function getUserConfig(mainKey,callback) {
        db.serialize(function () {//与或语句
            db.all("select mainValue from userConfig where mainKey = '" + mainKey + "'", function (err, row) {
                if (err) {
                    console.log(err);
                } else {
                    if(row && row[0]) {
                        callback(row[0]["mainValue"]);
                    }
                }
            })
        });
    }

    //查询某一页的数据
    //id：个人或群组的id
    //page：第几页
    function paging_personalChat(sender,recipient, currentPage, callBack) {
        var page = currentPage || 1, rowsCount = 0,pageCount=0;
        db.serialize(function () {//与或语句
            db.all("select DISTINCT infoDate as date,id,sender,receive,message,infoType as type from personageChat" +
                " where (sender = '"+sender+"' and receive = '"+recipient+"') or (sender = '"+recipient+"' and receive = '"+sender+"') " +
                " ORDER BY date ASC ", function (err, row) {
                if (err) {
                    console.log(err);
                } else {
                    rowsCount = row.length;
                    pageCount = rowsCount % pageRowsCount > 0 ? parseInt(rowsCount / pageRowsCount) + 1 : parseInt(rowsCount / pageRowsCount);
                    var pageData = {"data": [], "rowsCount": rowsCount, "page": page, "pageCount": pageCount};
                    if ((page - 1) * pageRowsCount < rowsCount) {
                        pageData.data = row.slice((pageCount -page) * pageRowsCount, (pageCount -page+1) * pageRowsCount);
                        //获得数据
                        if (callBack)
                        {
                            // document.getElementById("record__All").innerHTML="&#xe674;";
                            // document.getElementById("record__All").setAttribute("all_change","false");
                            callBack(pageData);
                        }
                    }else{
                        currPage -= 1;
                    }
                }
            })
        });
    }

    function paging_groupChat(groupId, Page, callBack) {
        var page = Page || 1, rowsCount = 0,pageCount=0;
        db.serialize(function () {
            db.all("select DISTINCT infoDate as date,id,groupId,sender,message,infoType as type from groupChat" +
                " where groupId = ?  ORDER BY date ASC ", [groupId], function (err, row) {
                if (!err) {
                    rowsCount = row.length;
                    pageCount = rowsCount % pageRowsCount > 0 ? parseInt(rowsCount/pageRowsCount)+1:parseInt(rowsCount/pageRowsCount);
                    var pageData = {"data": [], "rowsCount": rowsCount, "page": page,"pageCount":pageCount};
                    if ((page - 1) * pageRowsCount < rowsCount) {
                        pageData.data = row.slice((pageCount -page) * pageRowsCount, (pageCount -page+1) * pageRowsCount);
                    }
                    //获得数据
                    if (callBack){
                        //备注用
                        /*document.getElementById("record__All").innerHTML="&#xe64c;";
                        document.getElementById("record__All").setAttribute("all_change","false");*/
                        callBack(pageData);
                    }

                }else {
                    console.log(err);
                }
            });
        });
    }
    //校验本地消息中已显示过该消息
    function existPersonalChat(dateTime,callback){
        db.all("select count(*) as count from personageChat where infoDate = '" + dateTime + "'", function (err, row) {
            if (err) {
                console.log(err);
            } else {
                if(callback){
                    callback(row[0]["count"]);
                }
            }
        })
    }
    function existGroupChat(dateTime,callback){
        db.all("select count(*) as count from groupChat where infoDate = '" + dateTime + "'", function (err, row) {
            if (err) {
                console.log(err);
            } else {
                if(callback){
                    callback(row[0]["count"]);
                }
            }
        })
    }
    function upPersonalChat(messId,message,status,callback){
        db.run( "UPDATE personageChat SET message =?, infoType = ?  WHERE id = ?;",
            [message, status ||"2",messId], function (error) {
                if (error) {
                    console.log("添加数据时出错：" + error);
                }else{
                    callback(row[0]["count"]);
                }
            });
    }

    function upGroupChat(messId,message,status,callback){
        db.run( "UPDATE groupChat SET message =?, infoType = ?  WHERE id = ?;",
            [message, status ||"2",messId], function (error) {
                if (error) {
                    console.log("添加数据时出错：" + error);
                }else{
                    if(callback){
                        callback();
                    }
                }
            });
    }
    function getGuid(){
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        }).toUpperCase();
    }
    exports.chatHistorys = {
        addUserConfig:addUserConfig,
        getUserConfig:getUserConfig,
        addPersonalChat:addPersonalChat,
        addGroupChat:addGroupChat,
        paging_personalChat:paging_personalChat,
        paging_groupChat:paging_groupChat,
        upPersonalChat:upPersonalChat,
        upGroupChat:upGroupChat,
        checkGroupChat:existGroupChat,
        checkPersonalChat:existPersonalChat,
		init:init
    };
})(jQuery,require,window);
