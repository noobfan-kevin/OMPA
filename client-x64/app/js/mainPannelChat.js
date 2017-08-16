/**
 * Created by 安李恩 on 2015/12/9.
 * 主面板中的聊天事件
 */
//对项目的修改
function ProjectHelphand(mainConfig,userInfo){
    // var path = require('path')
    //     , fs = require('fs')
    //     , config_path = path.dirname(process.execPath);
    //
    // var configinfo = JSON.parse( fs.readFileSync(config_path+"/app/config/config.json",'utf8') );
    this.projectId = mainConfig.projectId;
    this.projectContent = "#project_list";
    this.projectContent2="#project_list2";
    this.projectBar = "#project-bar";   //projectBar元素的id
    this.chitList = "#linkmanLayer";    //个人聊天面板
    this.serverUrl = configInfo.server_url;
    this.userInfo = userInfo;
}
//获得项目id
ProjectHelphand.prototype.getProjectId = function(){
    return  project_id;
};

ProjectHelphand.prototype.rename = function(data){
    if( data.projectId == this.getProjectId()) {
        $(this.projectBar).find("span").text(data.name);
    }
    $("span[name = '" + data.projectId+"']").text(data.name);
};
//离开项目
ProjectHelphand.prototype.leaveProject = function(data){
    project.writeProject(data);
};
//加入项目
ProjectHelphand.prototype.joinProject = function(data){
    project.writeProject(data);
};
//添加项目人员
ProjectHelphand.prototype.addGovernMember = function(data){     //添加管理人员
    var _self =this;
    if(data.projectId == project_id) {
        var dataJob = data["job"] == "4.2" ? "4_2" : data["job"],
            $conTent = $("#" + dataJob),
            memberInfo = JSON.parse(data.memberInfo);
        $.each(memberInfo,function(index,val){
            $conTent.append(_self.userLiModel(val));
        });
    }
};
//添加项目中新创建的模块
ProjectHelphand.prototype.addModule = function(data){
    if (!data['projectId'] || !data['moduleId'] || !data['moduleName']) {
        throw "parameter is undefined!";
    }
    if (data.projectId == this.getProjectId()) {
        if (!this.existPart(data.moduleId)) {
            this.createPart(this.chitList, data["moduleId"], data['moduleName']);
        }
    }
};
//模块中添加人
ProjectHelphand.prototype.addModuleMember = function(data){
    var _self =this;
    if(data.projectId == this.getProjectId()) {
        var $conTent = $("#" + data.moduleId),
            memberInfo = JSON.parse(data.memberInfo);
        $.each(memberInfo,function(index,val){
            $conTent.append(_self.userLiModel(val));
        });
    }else {
        var flag = false;
        $.each($("#project_list").find("chi"), function (index, val) {
            var vId = val["name"];
            if (vId == data.projectId) {
                flag = true;
            }
        });
        if (!flag) {
            this.joinProject(data);
        }
    }
};

//删除模块人员
ProjectHelphand.prototype.delModuleMember = function(data){
    var _self =this;
    if(data.projectId == this.getProjectId()) {
        var $conTent = $("#" + data.moduleId);
        $conTent.find("#"+data.memberId).parent().remove();
        var $this = $("#linkmanLayer").find("[name='"+data.memberId+"']");//必须放在后面，若无该用户则删除临时对话框中的用户
        if(!$this.length){
            $("#linklasterLayer").find("[name='"+data.memberId+"']").remove();
        }
    }
    this.leaveProject(data);
    //if(this.existPartMember(data.memberId) < 1 && data.memberId == this.userInfo.id){    //没有在管理员中直接
    //    this.leaveProject(data);
    //}
};

//模块重命名
ProjectHelphand.prototype.reModuleName = function(data){
    if(!data.projectId || !data.moduleId || !data.name ){
        throw  "参数为空";
    }
    if(data.projectId == this.getProjectId()) {
        var $conTent = $("#" + data.moduleId);
        $conTent.prev().find("span").text(data.name);
    }
};

ProjectHelphand.prototype.existPartMember = function(memberId) {
    var $memberId = $("#" + memberId);
    return ($memberId && $memberId.length) || 0 ;
};

//创建项目聊天列表中的一部分
ProjectHelphand.prototype.createPart = function(parentId,partId,partName){
    $(parentId).children("ul.chatSiteBar").children(":last").before(this.$partHtmlModel(partId,partName));
};

//检查项目的用户列表中是否存在用户列表
//项目id和模块id
ProjectHelphand.prototype.existPart = function(moduleId){
    var $partObj = $("#"+moduleId);
    return $partObj && $partObj.length;
};
ProjectHelphand.prototype.$partHtmlModel = function(modelId,modelName){ //要的赋值
    var $model = $('<li ><div class="chatListGroup"><i class="iconfont">&#xe625;</i><span>partName</span></div><ul class="chatList"></ul></li>');
    $model.find("span").text(modelName);
    $model.find("ul").attr("id",modelId).hide();
    return $model;
};
//@data
//online    是否在线
//id        用户id
//image     用户头像地址
//name      用户名称
ProjectHelphand.prototype.userLiModel = function(data){
    var $addMemberModel = $("<li><div class='chat_item desaturate'>" +
        "<div class='ext'>15:13</div>" +
        "<div class='avatar'>" +
        "<div class='avatarBk'><img class='avatar' src='images/avatar.jpg' alt='avatar.png'/></div></div>" +
        "<div class='info'><span class='nickname'></span></div></div></li>");
    //对模板进行操作
    if(data["online"]){
        $addMemberModel.find("div.chat_item").removeClass("desaturate");
    }
    $addMemberModel.find("div.ext").text(PannelChat.getDateViewForm(new Date().getTime()));
    if(data["id"] ==  this.userInfo.id){
        $addMemberModel.find("div.ext").text('');
    }
    $addMemberModel.find("div.chat_item").attr("name",data["id"]).attr("id",data["id"]).attr("userinfo",JSON.stringify(data));
    $addMemberModel.find("img.avatar").attr("src",this.userInfo.configinfo.server_url+"/"+data["image"]);
    $addMemberModel.find("span.nickname").text(data["name"]);
    return $addMemberModel;
};

ProjectHelphand.prototype.delModule = function(data){
    if(data.projectId == this.getProjectId()) {
        $("#"+data.moduleId).parents("li").remove();
    }
    var $users = $("#"+this.userInfo.id);
    if(!$users || !$users.length){    //没有在管理员中直接
        this.leaveProject(data);
    }
};
//删除成员
ProjectHelphand.prototype.delMember = function(data){//
    if( data.projectId == this.getProjectId() ) {
        $("#" + data["memberId"]).parent().remove();
    }
};

//新消息
ProjectHelphand.prototype.addMessFlag = function(projectId){
    if(projectId != this.projectId ){
        $("#project-bar").addClass("newmsg");
        // $("[name='"+ projectId+"']").parent().addClass("newmsg");
        // SystemTray.startTray();
    }
};
//移除新消息
ProjectHelphand.prototype.remMessFlag = function(projId){
    if(projId != this.projectId ){
        $("#project-bar").removeClass("newmsg");
        $("[name='"+ projId+"']").parent().removeClass("newmsg");
        // SystemTray.stropTray();
    }
};
//标识未读消息
ProjectHelphand.prototype.addUserUnreadFlag = function(projectId,callback){
    var unReadObj = JSON.parse(localStorage.getItem("_unRead_" + projectId));
    if(unReadObj) {
        $.each(unReadObj, function (index, val) {
            var $obj = $("#" + val.sender);
            if ($obj && $obj.length) {
                $obj.children("div.avatar").addClass("newmsg");
            }
        });
        if(callback){
            callback();
        }
    }
};
//个人聊天的帮助类
function ChatUserHandle(mainConfig,userInfo) {
    var _userListOrder;   //用户列表中的默认排序
    this._projectId = mainConfig.projectId;
    this._userInfo = userInfo;
    this.setUserList = function(userListSortArr){
        _userListOrder = userListSortArr;
    };
    this.getUserList = function(){return _userListOrder;};
    this.linklasterLayer = "#linklasterLayer";  //存最近联系人的容器
}
//有用户上线
//最近面板中的上线
ChatUserHandle.prototype.recentlyOnline = function(userId) {
    var $recently = $("#" + userId + "_Recently");
    if ($recently && $recently.length) {
        if ($recently.hasClass("desaturate")) {
            $recently.removeClass("desaturate");
        }
    }
};
//最近面板中的离线
ChatUserHandle.prototype.recentlyOffLine = function(userId){
    var $recently = $("#" + userId + "_Recently");
    if ($recently && $recently.length) {
        if (!$recently.hasClass("desaturate")) {
            $recently.addClass("desaturate");
        }
    }
};
//在线用户列表的排序
ChatUserHandle.prototype.onLineSort= function(userId) {
    var $users = $("[name='"+userId+"']");
    var _self = this;
    if($users.length){
        userLiSort($($users[0]));
    }
    function userLiSort($userId) {
        var $self = $userId;
        var $queueFront = null;
        var arrIndex = -1;
        var userListOrder = _self.getUserList();
        arrIndex = userListOrder.indexOf(userId);
        $.each(userListOrder, function (index, val) {
            $self = $("#"+val);
            if (index == arrIndex) {
                return false;
            }
            if (!$self.hasClass("desaturate")) {
                $queueFront = $self;
            }
        });
        $userId.removeClass("desaturate");
        null == $queueFront ? $('.linkmanSiteBar').prepend($self.parent("li")) : $queueFront.parent("li").after($userId.parent("li"));
    }
};
//离线用户的排序
ChatUserHandle.prototype.offlineSort= function(userId) {
    var $users = $("[name='"+userId+"']"),
        _self = this;
    if($users.length){
        $users.addClass("desaturate");
        // $.each($users,function(index,val){
        offSort($($users[0]));
        // })
    }
    function offSort($userId) {
        /*var parentId = $userId.parents("ul.chatList").attr("id"),
         $queueFront = null,
         queueFront_index = 0,
         userListOrder = _self.getUserList(),
         arrIndex = -1,
         $self = null;

         if (!parentId) {
         console.log("parentId is null");
         return;
         }
         if (userListOrder[parentId] && userListOrder[parentId].indexOf) {
         arrIndex = userListOrder[parentId].indexOf(userId);
         }
         $.each(userListOrder[parentId], function (index, val) {
         $self = $("#" + parentId).find("#"+val);
         queueFront_index = index;
         if (index == arrIndex) {
         if ($queueFront)
         return false;
         }

         if ($self.hasClass("desaturate" && index != arrIndex)) {
         $queueFront = $self;
         if (index > arrIndex) return false;
         }
         });*/
        var userListOrder = _self.getUserList();
        var $self = $userId;
        var $queueFront = null;
        var arrIndex = -1;
        var queueFront_index = 0;
        if (userListOrder && userListOrder.indexOf) {
            arrIndex = userListOrder.indexOf(userId);
        }
        $.each(userListOrder, function (index, val) {
            $self = $("#"+val);
            queueFront_index = index;
            if (index == arrIndex) {
                if ($queueFront)
                    return false;
            }
            if ($self.hasClass("desaturate" && index != arrIndex)) {
                $queueFront = $self;
                if (index > arrIndex) return false;
            }
        });
        null == $queueFront ? $('.linkmanSiteBar').append($userId.parent("li")) : queueFront_index > arrIndex ? $queueFront.parent("li").before($userId.parent("li")) : $queueFront.parent("li").after($userId.parent("li"));
    }
};

// flag:true 插入到最近列表的第一位置,忽略则插到列表的最后
ChatUserHandle.prototype.addRecentlyUser = function(id,flag) {
    var $id = $("#" + id).eq(0),
        $linklasterLayer = $(this.linklasterLayer),
        $RecentlyId = $("#" + id + "_Recently");
    if ($RecentlyId && $RecentlyId.length)return;

    if ($id && $id.length) {
        var $html = $("<li>" + $id.parents("li").html() + "<li>");

        if ($html.find(".ext") && $html.find(".ext").children("img").length) {
            $html.find(".ext").remove();
        }
        $html.find("#" + id).attr("id", id + "_Recently").dblclick(function () {
            var thisId = $(this).attr("id");
            readMess_flag($(this));
            $("#" + thisId.toString().substring(0, thisId.length - 9)).triggerHandler("dblclick");
        }).on("mouseover", function () {
            $(this).addClass("current_chat_item");
        }).on("mouseleave", function () {
            $(this).removeClass("current_chat_item");
        });

        !flag ? $linklasterLayer.children("ul.linkgroupSiteBar").append($html) : $linklasterLayer.children("ul.linkgroupSiteBar").prepend($html);
    }
};
//未读信息的处理
function unReadMes_process(data){
    $.each(data, function (index, obj) {
        if(obj.message.length) {
            var $objSender = $("#" + obj.sender);
            if ($objSender.length) {
                MessageHandle.unReadMessFlag($objSender);
            }
        }
    })
}

(function(exports,$) {
    var path = require('path')
        , fs = require('fs')
        , config_path = path.dirname(process.execPath);

    var configinfo = JSON.parse( fs.readFileSync(config_path+"/app/config/config.json",'utf8') );
    var socket = null,
        singleSocket = null,
        userInfo = JSON.parse(localStorage.getItem("userInfo")),
        projectHelphand = null,
        chatUserHandle = null,
        groupHelphand = null,
        mainConfig = {},
        signFlagArr = [],
        myNotification = null,
        mainPannel_config = {
            guiObj: {},
            gui: require('nw.gui'),
            isShowWindow: true,
            baseUrl: configinfo.server_url
        };

    var chatHelphand = {
        getUsers:function(callBack){
            var serverUrl= userInfo.configinfo.server_url,
                _userList = [];
            var _this= this;
            $.ajax({
                type : 'get',
                url : serverUrl+"/api/user",
                success : function(data2) {
                    var div=document.getElementById("linkmanLayer");
                    div.innerHTML= "";
                    var ul=document.createElement("ul");
                    div.appendChild(ul);
                    ul.setAttribute("class","chatSiteBar linkmanSiteBar");
                    $.each(data2.list,function(i,n){
                        _userList.push(n.id);
                        var userId =n.id;
                        var userinfo={
                            id:n.id,
                            user_name:n.user_name,
                            chinese_name:n.name,
                            image: n.image,
                            job:n.job
                        };
                        var li=document.createElement("li");
                        ul.appendChild(li);
                        var div2=document.createElement("div");
                        div2.setAttribute("id",userId);
                        div2.setAttribute("name",userId);
                        div2.setAttribute("class","chat_item desaturate");
                        div2.setAttribute("userInfo",JSON.stringify(userinfo));
                        div2.innerHTML="<div class=\"ext\">15:13</div><div class=\"avatar\"><div class=\"avatarBk\"><img class=\"avatar\" src=\""+ serverUrl+ '/'+ userinfo.image+ "\" alt=\"avatar.png\"/></div></div><div class=\"info\"><span class=\"nickname\">"+userinfo.chinese_name.replace(/ /g,'&nbsp;')+"</span><div class=\"new-tip\"></div></div>";//<h3 class=\"nickname\"><span class=\"nickname_text\">" +userinfo.chinese_name +"</span></h3></div>"
                        $(div2).appendTo($(li));
                        closureFun(div2, userId);
                    });
                    function closureFun(div, userId)
                    {
                        chatHelphand.AddFriendPannel(div, userId);
                    }
                    if(callBack){
                        callBack(_userList);
                    }
                },
                error:function(data){
                    alert("获取用户失败");
                }
            });
        },
        AddFriendPannel: function(div, userId){
            //好友信息面板
            $(div).find('.avatarBk').hover(function(){
                var PersonItemObj= $(this).closest('li');
                var offsetY= PersonItemObj.offset().top;
                //获取面板窗口当前位置
                var mainPannel= require('nw.gui').Window.get();
                var curPos= {};
                curPos.x= mainPannel.x;
                curPos.y= mainPannel.y;

                briefPersonInfo.x= curPos.x- briefPersonInfo.width;
                var briefPersonInfoY= curPos.y+ offsetY;
                if(briefPersonInfoY+ briefPersonInfo.height> mainPannel.y+ mainPannel.height)
                {
                    briefPersonInfoY= briefPersonInfoY- briefPersonInfo.height+ PersonItemObj.height();
                }
                briefPersonInfo.y= briefPersonInfoY;
                briefPersonInfo.show();
                briefPersonInfo.window.setUserId(userId);
            });
            $(div).closest('li').on('mouseleave', function(){
                if(briefPersonInfo)
                {
                    briefPersonInfo.hide();
                }
            });
        },
        getDateViewForm: function (date) {
            var dateTime = new Date(date),
                dateTime_year = dateTime.getFullYear(),
                dateTime_Month = (dateTime.getMonth() + 1),
                dateTime_Day = dateTime.getDate(),
                dateTime_Hours = dateTime.getHours(),
                dateTime_minutes = dateTime.getMinutes();
            var newDate = new Date(),
                newDate_year = newDate.getFullYear(),
                newDate_Month = (newDate.getMonth() + 1),
                newDate_Day = newDate.getDate();
            if (dateTime_year == newDate_year) {
                if (dateTime_Month == newDate_Month) {
                    if (dateTime_Day == newDate_Day) {
                        return (dateTime_Hours >= 10 ? dateTime_Hours : "0" + dateTime_Hours) + ":" + (dateTime_minutes >= 10 ? dateTime_minutes : "0" + dateTime_minutes);
                    }
                }
                return dateTime_year.toString().slice(2, 4) + "/" + dateTime_Month + "/" + dateTime_Day;//不是当天和不是本月的
            }
            return dateTime_year + "/" + dateTime_Month + "/" + dateTime_Day;//不是今年
        },
        //设置聊天时间
        setChatTime : function(time,userId) {
            if (time) {
                var $user = $("[name='" + userId + "']");
                if(!$user.eq(0).parents("ul").hasClass("linkgroupSiteBar")) {
                    if ($user.length) {
                        $user.find(".ext").text(time);
                    }
                }
            }
        },
        //获得关闭时间
        getCloseTime: function (fn) {
            $.ajax({
                type: 'get',
                url: userInfo.configinfo.server_url + "/api/messageStatus/" + userInfo.id,
                // data:"projectId=" + mainConfig["projectId"],
                success: function (data) {
                    if (data) {
                        $.each(data.list, function (index, val) {
                            chatHelphand.setChatTime(chatHelphand.getDateViewForm(val['chatTime']), val.senderId);
                        });
                        var $userId = $("[name ='" + userInfo.id + "']");
                        $userId && $userId.length && $userId.find(".ext").text("");
                    }
                },
                error: function (data) {
                    console.debug("获取时间失败！");
                }
            });
        },
        //获取未读信息，receiveid:本人id
        getNoReadInfo: function (fn) {
            $.ajax({
                type: 'get',
                url: userInfo.configinfo.server_url + "/api/chat/getNoReadInfo/" + userInfo.id,
                success: function (data) {
                    if (data.ok) {
                        if (fn)
                            fn(data.list);
                    }
                },
                error: function (data) {
                    console.debug("修改成功");
                }
            });
        },
        //最近聊天 id的后缀为_Recently
        getRecentlyList: function () {
            var recently = RecentlyUser.getRecently(userInfo,mainConfig["projectId"]);
            $.each(recently, function (index, val) {
                chatHelphand.recentlyChat(val.id);
            });
        },
        recentlyRemov : function(id) {
            var $recently = $("#" + id + "_Recently");
            if ($recently && $recently.length) {
                $recently.parents("li").remove();
            }
        },
        //聊天的人或群组
        recentlyChat: function (id) {
            var $id = $("#" + id + "_Recently"), $recentHtml = null;
            if ($id && $id.length) { //已经存在则直接提前
                $recentHtml = $id.parent("li");
                $("#linklasterLayer").children("ul.linkgroupSiteBar").prepend($recentHtml);
            } else {//没有存在则添加，并提前
                var $this = $("#" + id).parent("li"),
                    html = $this.html();
                if($this && $this.length) {
                    if ($this && $this.find(".ext") && $this.find(".ext").children("img").length) {
                        $this.find(".ext").remove();
                    }
                    $recentHtml = $("<li>" + html + "</li>");
                    $recentHtml.find("#" + id).removeAttr("id").attr("id", id + "_Recently").dblclick(function () {
                        $(this).find("div.avatar").removeClass("newmsg");
                        var id = $(this).attr("id");
                        $("#" + id.toString().substring(0, id.length - 9)).triggerHandler("dblclick");

                    }).on("mouseover", function () {
                        $(this).addClass("current_chat_item");
                    }).on("mouseleave", function () {
                        $(this).removeClass("current_chat_item");
                    });
                    $("#linklasterLayer").children("ul.linkgroupSiteBar").prepend($recentHtml);
                    if (document.getElementById(id + "_Recently") !== null) {
                        // document.getElementById(id + "_Recently").childNodes[1].setAttribute("class", "avatar");
                    }
                }
            }
        },
        //打开窗口
        openGuiWindow: function (guiName, paramObj) {
            var gui = mainPannel_config.gui,
                defaultParam = {
                    title: paramObj["title"],
                    position: 'center',
                    width: 592,/*860 76*3  860-228=632*/
                    height: 600,
                    toolbar: true,
                    frame: true
                },
                guiWindow = null,
                guiObj = mainPannel_config.guiObj[guiName];

            if (!guiObj) {
                guiWindow = gui.Window.open(paramObj.openUrl, defaultParam);
                guiWindow.on('loaded', function () {
                    guiWindow.window.mainWindowFn.setMainWindow(gui.Window.get(), mainConfig["projectId"], mainConfig["project_Name"]);
                    guiWindow.window.fileope.setMainWindow(gui.Window.get(), mainConfig["projectId"]);
                    if (guiWindow.window[paramObj.fnName]) {
                        guiWindow.window[paramObj.fnName].apply(guiWindow, paramObj.fnPara);
                    }
                    this.focus();
                });
                mainPannel_config.guiObj[guiName] = guiWindow;
            } else {
                guiObj.window.notaddUsers = false;
                guiObj.window[paramObj.fnName].apply(guiObj, paramObj.fnPara);
                guiObj.focus();
            }
        },
        closeProjAllWin : function(projectId) {
            if(!projectId) return;
            var openWinArr = [projectId + "_ChildWindow" ,projectId + '_GroupWindow'];
            $.each(openWinArr,function(index,val){
                var guiObj = mainPannel_config.guiObj[val];
                if (guiObj) {
                    guiObj.window.close();
                }
            });
            // SystemTray.stropTray();
        },
        //清除窗口
        cleanGuiWindwo: function (guiName) {
            if (mainPannel_config.guiObj[guiName]) {
                mainPannel_config.guiObj[guiName] = null;
            }
        },
        //调用子窗口里的方法
        callWinMethod: function (methName, arrPara, arrWinName) {
            $.each(mainPannel_config.guiObj, function (index, val) {
                if (val) {
                    val.window.mainWindowFn[methName].apply(null, arrPara);
                }
            });
        },
        //获得某项目id下的群组聊天窗口
        getGroupWin : function(pjId){
            return mainPannel_config.guiObj[pjId + '_GroupWindow'];
        },
        //获得个人聊天的消息
        getChatUserInfo : function (id) {
            return $("#" + id).eq(0).attr("userinfo");
        },
        getUserImageUrl : function (id) {
            var $userId = $("#" + id).eq(0);
            return $userId && $userId.length && $userId.find("img.avatar").attr("src");
        },
        //获得群组的图片
        getGroupImageUrl : function (groupId) {
            var $groupId = $("#" + groupId);
            return $groupId && $groupId.length && $groupId.find("img.avatar").attr("src");
        },
        //获得群组的名称
        getGroupName : function (groupId) {
            var $groupId = $("#" + groupId);
            return $groupId && $groupId.length && $groupId.find("span.nickname_text").text();
        },
        openUserDialog:function(userId) {
            getGuiWindow().openChildWindow($("div#" + userId)[0]);
        }
    };
    var MessageHandle = {
        localStoPut: function (mes_key, messObj) {
            var userMes = localStorage.getItem(mes_key),
                oldArr = [];
            if (userMes) {
                oldArr = JSON.parse(localStorage.getItem(mes_key));
                oldArr instanceof Array ? oldArr.push(messObj) : oldArr = [];
                localStorage.setItem(mes_key, JSON.stringify(oldArr));
            } else {          //此处只是简单的存储，没有时间标识
                localStorage.setItem(mes_key, JSON.stringify([messObj]));
            }
        },
        localStoDel : function(mes_key,Id){
            var userMes = localStorage.getItem(mes_key),
                oldArr = [];
            if (userMes) {
                oldArr = JSON.parse(localStorage.getItem(mes_key));
                $.each(oldArr,function(index,val){

                    if(val && val["sender"] == Id){
                        oldArr.splice(index,1);
                    }
                });
                localStorage.setItem(mes_key, JSON.stringify(oldArr));
            }
        },
        unreadMess_saveMess: function (mes_key, data) {   //未读消息的保存
            var messObj = {"sender": data.sender, "mess": data.msg, "date": data.date};
            MessageHandle.localStoPut(mes_key, messObj);
            notification.newNoti(data);
        },
        unReadMessFlag: function ($obj,num) {
            //添加未读消息的标记
            /*if (!$obj.hasClass("newmsg")) {
                $obj.children("div.avatar").addClass("newmsg");
            }*/
            var new_tip = $obj.children("div.info").children('div.new-tip');
            // console.log($obj.children("div.info").children('div.new-tip').is(':hidden'))
            if(new_tip.is(':hidden')){
                new_tip.show();

            }
            new_tip.text(num);
        },
        removeProjectFlag : function(mes_key,prjId){
            var userMes = localStorage.getItem(mes_key),
                oldArr = [];
            if (userMes) {
                oldArr = JSON.parse(localStorage.getItem(mes_key));
                if(!oldArr.length){
                    projectHelphand.remMessFlag(prjId);
                }
            }
        }
    };

    var notification = {
        newNoti: function (data,groupFlag) {
            var userdiv = document.getElementById(data.sender),
                self = this;

            if(userdiv) {
                if (myNotification) {
                    myNotification.close();
                }

                var userinfo = JSON.parse(userdiv.getAttribute("userinfo")),
                    title = userinfo.chinese_name || userinfo.name,
                    titleName = "";
                if (groupFlag) {
                    var groupName = $("#" + data.groupId).find(".nickname_text").text();
                    titleName = "群组 " + groupName + " 有新消息";
                } else {
                    titleName = title + " 发来新消息"
                }
                myNotification = new Notification(titleName, {
                    body: "新消息",
                    icon: "images/logo.png"
                });
                if (groupFlag) {
                    myNotification.onclick = function () {  //群组的提示——暂未添加
                        userdiv = data.groupId,
                            $thisGroup = $("#" + userdiv);
                        if($thisGroup.length) {
                            $thisGroup.triggerHandler("dblclick");
                        }
                    };
                } else {
                    myNotification.onclick = function () {
                        readMess_flag($(userdiv));
                        talkWindow(userdiv);
                        self.checkSignFlag();
                    };
                }
            }
        },
        chatTabItem : function() {  //缩写为  cti
            return $(".add_popup_icon.manpup_icon");
        },
        cti_addFlag: function(){  // chatTabItem 缩写为 cti
            this.chatTabItem().prev().addClass("newmsg");
        },
        cti_removeFlag: function(){
            this.chatTabItem().prev().removeClass("newmsg");
        },
        cleanSignFlag : function() {
            this.cti_removeFlag();
            this.cti_childRemoveFlag(0);
            this.cti_childRemoveFlag(1);
            this.cti_childRemoveFlag(2);
            signFlagArr = [];
        },
        cti_childAddFlag : function(index){
            this.chatTabItem().children(".popup_wrapper").children("li").eq(index).children("i").addClass("newmsg");
        },
        cti_childRemoveFlag : function(index){
            this.chatTabItem().children(".popup_wrapper").children("li").eq(index).children("i").removeClass("newmsg");
        },
        checkSignFlag : function(){
            this.chatRemoveSignFlag();
            this.groupRemoveSignFlag();
            this.recentlyRemoveSignFlag();
        },
        signFlagArrPush : function(signName){
            var flag = true;
            $.each(signFlagArr,function(index,val) {
                if (signName && signName == val) {
                    flag = false;
                }
            });
            if(flag) {
                signFlagArr.push(signName);
            }
            this.checksingFlag();
        },
        signFlagArrRem : function(signName){
            $.each(signFlagArr,function(index,val) {
                if (signName && signName == val) {
                    signFlagArr.splice(index,1);
                }
            });
            this.checksingFlag();
        },
        checksingFlag : function() {
            if(!signFlagArr.length){//移除闪烁
                // SystemTray.stropTray();
                this.cti_removeFlag();
            }else{  //添加闪烁
                this.cti_addFlag();
                // SystemTray.startTray();
            }
        },
        checkFlagCondition : function(singFlag,index){
            var flag = true;
            $.each(signFlagArr,function(_index,val) {
                if (singFlag && singFlag == val) {
                    flag = false;
                }
            });
            if(flag){
                this.cti_childRemoveFlag(index);
            }
            this.checksingFlag();
        },
        //个人聊天时删除和群组删除时   移除标记
        chatAddSignFlag : function(){
            this.cti_childAddFlag(0);
            this.signFlagArrPush("chat");
        },
        chatRemoveSignFlag : function() {
            var $singFlag = $("#linkmanLayer").find(".newmsg");
            if (!$singFlag.length) {
                this.signFlagArrRem("chat");
                this.checkFlagCondition("chat", 0);
            }else{
                this.chatAddSignFlag();
            }
            this.recentlyRemoveSignFlag();
        },
        groupAddSignFlag : function(){
            this.cti_childAddFlag(1);
            this.signFlagArrPush("group");
        },
        groupRemoveSignFlag : function(){
            var $singFlag = $("#linkgroupLayer").find(".newmsg");
            if(!$singFlag.length) {
                this.signFlagArrRem("group");
                this.checkFlagCondition("group",1);
            }else{
                this.groupAddSignFlag();
            }
            this.recentlyRemoveSignFlag();
        },
        recentlyAddSignFlag : function(){
            this.cti_childAddFlag(2);
            this.signFlagArrPush("recently");
        },
        recentlyRemoveSignFlag : function(){
            var $singFlag = $("#linklasterLayer").find(".newmsg");
            if(!$singFlag.length) {
                this.signFlagArrRem("recently");
                this.checkFlagCondition("recently",2);
                this.checksingFlag();
            }else{
                this.recentlyAddSignFlag();
            }
        }
    };

    function getGuiWindow() {
        return {
            openChildWindow: function (contain) {
                if(!$(contain).attr("userInfo")){
                    return false;
                }
                if ($(contain).attr("id") == userInfo.id) {//不能和自己聊天
                    return;
                }
                var openUrl = 'mainPersonalChat.html?userinfo=' + $(contain).attr("userInfo"),
                    paramObj = {
                        openUrl: openUrl,
                        title: "单人聊天",
                        fnName: "addTalkUsers",     //loaded时调用的方法名称，
                        fnPara: [$(contain).attr("userInfo"), !$(contain).hasClass("desaturate"), mainPannel_config.baseUrl]   //loaded时传入的参数
                    };
                MessageHandle.localStoDel("_unRead_" + mainConfig["projectId"],$(contain).attr("id"));
                chatHelphand.openGuiWindow(mainConfig["projectId"] + "_ChildWindow", paramObj);
            },
            cleanGuiWindow: function (guiName) {
                if (guiName) {
                    chatHelphand.cleanGuiWindwo(guiName);
                } else {
                    throw  "guiName is Error"
                }
            },
            openGroupWindow: function (groupinfo) {
                var paramObj = {
                    openUrl: 'mainContain.html',
                    title: "群组聊天",
                    fnName: "addTalkGroup",
                    fnPara: [groupinfo, mainConfig["projectId"]]
                };
                chatHelphand.openGuiWindow(mainConfig["projectId"] + '_GroupWindow', paramObj);
            },
            closeWindow: function () {
                var gui = mainPannel_config.gui,
                    win = gui.Window.get();
                mainPannel_config.isShowWindow = false;
                closeWindowGui();
                // SystemTray.closeWindow(true);
                win.close();
            },
            minimizeWindow: function () {
                var gui = mainPannel_config.gui,
                    win = gui.Window.get();
                win.minimize();
            }
        }
    }

    // 获得socket
    function getSocket(socketUrl) {      //单例——获得套接字
        if (!singleSocket) {
            socket = singleSocket = socketConnect(socketUrl);
        }
        return singleSocket;
        function socketConnect(url) {
            var socketConnect = io.connect(url,{'reconnection': true }),
                args = null;
            return {
                on: function (eventName, callback) {
                    socketConnect.on(eventName, function () {
                        args = arguments;
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                },
                emit: function (eventName, data) {
                    socketConnect.emit(eventName, data);
                }
            };
        }
    }

    function setUserListOrder(userListSortArr) {
        if (!userListSortArr) {
            throw " arguments is undefined ";
        }
        chatUserHandle.setUserList(userListSortArr);
    }

    function setProjectId(projectId,project_Name) {
        notification.cleanSignFlag();
        mainConfig["projectId"] = projectId;
        mainConfig["project_Name"] = project_Name;
        groupHelphand.init(projectId);
        setTimeout(function(){
            chatHelphand.getRecentlyList();
        },800);
    }

    function addUserFlag(projectId) {
        projectHelphand.addUserUnreadFlag(projectId,function(){
            notification.checkSignFlag();
        });
    }

    function initSocketEvent(userInfo) {
        socket = getSocket(configinfo.server_url);

        projectHelphand = new ProjectHelphand(mainConfig, userInfo);
        chatUserHandle = new ChatUserHandle(mainConfig, userInfo);
        groupHelphand = new GroupHelphand(mainConfig, userInfo);
        groupHelphand.init();
        socket.on("online", function (data) {
            var userId = data.userId;
            chatUserHandle.onLineSort(userId);
            chatHelphand.callWinMethod("upOrDown_line", [userId, true]);
            chatUserHandle.recentlyOnline(userId);
        });
        socket.on("offline", function (data) {          //下线
            var userId = data.userId;
            chatUserHandle.offlineSort(userId);
            chatUserHandle.recentlyOffLine(userId);
            chatHelphand.callWinMethod("upOrDown_line", [userId, false]);
        });
        socket.on('friend', function (data) {   //后台获得在线的朋友
            $.each(data.users, function (attr_userId, val) {
                if (val.onLine) {
                    chatUserHandle.onLineSort(attr_userId);
                    chatUserHandle.recentlyOnline(attr_userId);
                }
            });
        });

        //加入个项目
        socket.on("joinProject", function (data) {
            projectHelphand.joinProject(data);
        });
        //离开项目
        socket.on("leaveProject", function (data) {
            projectHelphand.leaveProject(data);
            chatHelphand.closeProjAllWin(data.projectId);
        });
        //添加成员
        socket.on("addGovernMember", function (data) {
            projectHelphand.addGovernMember(data);
        });
        //删除项目成员
        socket.on("projectDelMember", function (data) {
            projectHelphand.delMember(data);
        });
        //项目重命名
        socket.on("projectRename", function (data) {
            projectHelphand.rename(data);
        });
        socket.on("addModule", function (data) {
            projectHelphand.addModule(data);
        });
        //加入模块
        socket.on("joinModule", function (data) {
            projectHelphand.joinPart(data);
        });
        socket.on("addModuleMember", function (data) {
            projectHelphand.addModuleMember(data);
        });
        socket.on("delModuleMember", function (data) {
            projectHelphand.delModuleMember(data);
            if (data.projectId == mainConfig["projectId"]) {
                //关闭聊天窗口中的用户
                var childWindow = mainPannel_config.guiObj[data.projectId + "_ChildWindow"];
                if(childWindow) {
                    childWindow.window.mainWindowFn.closeUserWin(data.memberId);
                }
            }
        });
        socket.on("reModuleName", function (data) {
            projectHelphand.reModuleName(data);
        });
        socket.on("delProjectModule", function (data) {
            projectHelphand.delModule(data);
        });

        //单聊
        socket.on("singleChat", function (data) {

            chatHelphand.setChatTime(chatHelphand.getDateViewForm(new Date()), data.sender);
            chatHelphand.setChatTime(chatHelphand.getDateViewForm(new Date()), data.sender + "_Recently");
            chatHelphand.recentlyChat(data.sender);

            var mes_key = "Win_off_mess_" + data.projectId + data.sender,
                $senders = $("[name='"+data.sender+"']"),
                $sender_recently = $("#" + data.sender + "_Recently");

            //检查子页面是否有该用户的聊天对话框_Recently
            var childWindow = mainPannel_config.guiObj[data.projectId + "_ChildWindow"];

            if (data.projectId != mainConfig["projectId"]) {
                if (!childWindow || childWindow["window"] && !childWindow.window.checkUserExist(data.sender)) {
                    projectHelphand.addMessFlag(data.projectId);
                    MessageHandle.localStoPut("_unRead_" + data.projectId, {"sender": data.sender});
                }
            }

            //项目id  并保存发送人，表示这些为未读消息
            if (!childWindow) {
                if (data.projectId == mainConfig["projectId"]) {
                    MessageHandle.unreadMess_saveMess(mes_key, data);
                    notification.chatAddSignFlag();

                    $.each($senders,function(index,val){
                        var msgNum ;
                        if(!$(val).find('.new-tip').html()){
                            msgNum = 1;
                        }
                        else {

                            msgNum = parseInt($(val).find('.new-tip').html())+1;
                        }
                        MessageHandle.unReadMessFlag($(val),msgNum);
                    });

                    /*if ($sender_recently && $sender_recently.length) {
                        console.log(data)
                        MessageHandle.unReadMessFlag($sender_recently,msgNum);
                        notification.recentlyAddSignFlag();
                    }*/
                }

            } else {

                if (childWindow && childWindow["window"] && childWindow.window.checkUserExist(data.sender)) {
                    if (!childWindow.window.mainWindowFn.getIsfocus()) {
                        notification.newNoti(data);
                    }
                    childWindow.window.mainWindowFn.receiveMessage(data.msg, data.sender, data.date);
                } else {
                    // if (data.projectId == mainConfig["projectId"]) {
                        MessageHandle.unreadMess_saveMess(mes_key, data);
                        $.each($senders, function (index, val) { //按name属性获取对象
                            var msgNum ;
                            if(!$(val).find('.new-tip').html()){
                                msgNum = 1;
                            }
                            else {

                                msgNum = parseInt($(val).find('.new-tip').html())+1;
                            }
                            MessageHandle.unReadMessFlag($(val),msgNum);
                        });
                        /*if ($sender_recently && $sender_recently.length) {
                            MessageHandle.unReadMessFlag($sender_recently);
                            notification.recentlyAddSignFlag();
                        }*/
                    // }

                }
            }
        });

        socket.on("singleChat_me",function(data){
            console.log(data)
            var childWindow = mainPannel_config.guiObj[data.projectId + "_ChildWindow"];
            //项目id  并保存发送人，表示这些为未读消息
            if (childWindow) {
                childWindow.window.mainWindowFn.receiveMessage_me(data.msg, data.recipient, data.date,data.projectId);
            }
        });

        //用户在其它处登录
        socket.on("secondaryLogon", function (data) {
            if (userInfo.id == data.Id) {
                //socket.disconnect();
                // SystemTray.closeWindow(true);
                window.location = "login.html?flag=AlongDistanceLogin";
            }
        });
        ////断开连接的处理
        socket.on('disconnect', function (data) {
            chatHelphand.callWinMethod("upOrDown_line", [userInfo.id, false]);
            //用户面板中的用户离线
            var userList = $(".chatSiteBar.linkmanSiteBar").find("ul.chatList").children("li").children("div").addClass("desaturate");

            //群聊中的模板离线
            var groupList = $(".chatSiteBar.linkgroupSiteBar").find("div.chat_member_group");
            groupList.addClass("desaturate");

            $("#linklasterLayer").children("ul").children("li").children("div").addClass("desaturate");
            //所有群组离线
            var groupWindow = chatHelphand.getGroupWin(mainConfig.projectId);
            if (groupWindow) {
                groupWindow.window.groupOffLine();
            }
            // SystemTray.iconOffLine();
            $("#PersonalInfoBtn").addClass("desaturate");
        });

        socket.on("reconnect", function (e) {
            setTimeout(function () {
                var emitHandle = getEmitMes();
                emitHandle.connectEmitMess(userInfo.id, userInfo.chinese_name);
                emitHandle.getFriend();
                emitHandle.getNoReadMess();

                //群的离线状态修改
                var groupList = $(".chatSiteBar.linkgroupSiteBar").find("div.chat_member_group");
                groupList.removeClass("desaturate");

                $.each(groupList, function (index, val) {
                    var groupId = $(val).attr("id");
                    $groupRecently = $("#" + groupId + "_Recently");
                    if ($groupRecently && $groupRecently.length) {
                        $groupRecently.removeClass("desaturate");
                    }
                });
                var groupWindow = chatHelphand.getGroupWin(mainConfig.projectId);
                if (groupWindow) {
                    groupWindow.window.groupOffLine();
                }
                // SystemTray.iconOnLine();
                $("#PersonalInfoBtn").removeClass("desaturate");
            },90000); //90S后再上线
        });

        //处理离线消息
        socket.on("noRead_mess", function (data) {
            var noRead_mess = data.noRead_mess, localVal = {};
            var personwin=mainPannel_config.guiObj[mainConfig["projectId"] + "_ChildWindow"];
            var groupwin=mainPannel_config.guiObj[mainConfig["projectId"] + "_GroupWindow"];
            if (noRead_mess && noRead_mess.length > 0) {
                $.each(noRead_mess, function (attrName, val) {
                    var sender = val.sender,
                        lastMes = null,
                        receiverId = val.receiverId;
                    if ($.trim(val.message)) {
                        if (sender != userInfo.id) {
                            var $senders = $("[name='"+sender+"']");
                            $.each($senders,function(index,val){
                                MessageHandle.unReadMessFlag($(val),noRead_mess.length);
                            });
                            MessageHandle.unReadMessFlag($("#" + sender + "_Recently"),noRead_mess.length);
                        }

                        if(!localVal[sender])
                            localVal[sender]=[];//

                        localVal[sender].push(val);
                        lastMes = val;
                        chatHelphand.setChatTime(chatHelphand.getDateViewForm(lastMes.time), sender);
                        chatHelphand.setChatTime(chatHelphand.getDateViewForm(lastMes.time), sender + "_Recently");
                    }
                });
                notification.checkSignFlag();
                localStorage.setItem("noRead_mess" + mainConfig["projectId"] + userInfo.id, JSON.stringify(localVal));
            }
        });

        //获得群成员
        socket.on("groupMember", function (data) {
            console.log(data)
            // if (data.pjId) {
                chatHelphand.getGroupWin(data.pjId).window.getGroupInfo(data);
            // }
        });

        //群消息
        socket.on("groupMess", function (data) {
            chatHelphand.recentlyChat(data.groupId);
            var mes_key = "Win_off_mess_" + data.groupId,
                $sender = $("#" + data.groupId),
                $groupId_recently = $("#" + data.groupId + "_Recently"),
                pjId = data.pjId;

            var groupWindow = chatHelphand.getGroupWin(pjId);

            if(data['sender'] == userInfo.id){
                if(groupWindow) {
                    groupWindow.window.receiveGroupMess_me(data);
                }
            }else {
                if (pjId != mainConfig["projectId"]) {
                    if (!groupWindow || (groupWindow && !groupWindow.window.checkUserExist(data.groupId))) {
                        projectHelphand.addMessFlag(data.pjId);
                        MessageHandle.localStoPut("_unRead_" + data.pjId, {"sender": data.groupId});
                    }
                }
                if (!groupWindow) {         //没打开则追加
                    if (pjId == mainConfig["projectId"]) {
                        groupHelphand.groupMess_saveMess(mes_key, data);
                        var msgNum ;
                        if(!$($sender).find('.new-tip').html()){
                            msgNum = 1;
                        }
                        else {

                            msgNum = parseInt($($sender).find('.new-tip').html())+1;
                        }
                        groupHelphand.groupMess_flag($sender,msgNum);
                        notification.groupAddSignFlag();
                        if ($groupId_recently && $groupId_recently.length) {
                            groupHelphand.groupMess_flag($groupId_recently,msgNum);
                            notification.recentlyAddSignFlag();
                        }
                    }
                } else {
                    if (groupWindow && groupWindow.window.checkUserExist(data.groupId)) {
                        groupWindow.window.receiveGroupMess(data);
                    } else {
                        if (pjId == mainConfig["projectId"]) {
                            var msgNum ;
                            if(!$($sender).find('.new-tip').html()){
                                msgNum = 1;
                            }
                            else {

                                msgNum = parseInt($($sender).find('.new-tip').html())+1;
                            }
                            groupHelphand.groupMess_flag($sender,msgNum);
                            notification.groupAddSignFlag();

                            if ($groupId_recently && $groupId_recently.length) {
                                groupHelphand.groupMess_flag($groupId_recently,msgNum);
                                notification.recentlyAddSignFlag();
                            }
                        }
                        groupHelphand.groupMess_saveMess(mes_key, data);
                    }
                }
            }
        });

        //刷新旁边的群组
        socket.on("groupUserRefresh", function (data) {
            groupHelphand.getUserGroupInfo(mainConfig["projectId"]);
            var groupWindow = chatHelphand.getGroupWin(data.pjId);
            if (groupWindow) {
                groupWindow.window.groupUserRefresh(data);
            }
        });
        socket.on("groupDelUsers", function (data) {
            var groupWindow = chatHelphand.getGroupWin(data.pjId);
            if (userInfo.id == data.userId) {
                $("#" + data.groupId + "_Recently").parent("li").remove();
                $("#" + data.groupId).parent("li").remove();
                if (groupWindow) {
                    groupWindow.window.groupClose(data);
                }
            }
            else {
                if (groupWindow) {
                    groupWindow.window.groupUserRefresh(data);
                }
            }
        });
        //删除群组
        socket.on("delGroup", function (data) {
            var groupId = data.groupId,
                $groupId = $("#" + groupId),
                $recently = $("#" + groupId + "_Recently");
            if ($groupId.length) {
                $groupId.parents("li").remove();
            }
            groupHelphand.groupMess_readFlag($groupId);
            groupHelphand.groupMess_readFlag($recently);

            if ($recently && $recently.length) {
                $recently.parents("li").remove();
            }
            var groupWindow = chatHelphand.getGroupWin(data.pjId);
            if (groupWindow) {
                groupWindow.window.groupClose(data);
            }

            var key = "_unRead_" + data.pjId;
            if(key) {
                MessageHandle.localStoDel(key, groupId);
                MessageHandle.removeProjectFlag(key,data.pjId)
            }

            notification.checkSignFlag();
        });

        socket.on("changeGroupInfo", function (data) {
            groupHelphand.changeGroupInfo(data,chatHelphand.getGroupWin(data.pjId));
        });
        socket.on("newNotice",function(data){
            project.newProNotise(data.projectId)
            if(data.projectId===project_id) {
                notice.init();
            }
        });
        socket.on("newTask",function(data){
            project.scoreFlush(data);
        });
        socket.on("delUser",function(data){
            user.deleteUser(data.Id);
        });
    }

    function closeWindowGui(){
        if(mainPannel_config.guiObj){
            $.each(mainPannel_config.guiObj,function(key,val){
                if(val){
                    val.window.closeWindow();
                }
            })
        }
    }
    //向后台发送信息
    function getEmitMes() {
        return {
            connectEmitMess: function (userId, userName) { //连接套接字需要发送的数据
                socket.emit("online", {"userId": userId, "userName": userName, "pjId": mainConfig.projectId});    //上线
            },
            getNoReadMess: function () {
                socket.emit('getMess_noRead', {"pjId": mainConfig.projectId});   //获得离线消息
            },
            getFriend: function () {
                socket.emit('getFriend', {"pjId": mainConfig.projectId});//获得在线好友
            },
            getGroupUser: function (id) {         //获得群成员
                socket.emit("getGroupMember", {'groupId': id});
            },
            sendGroupMess: function (groupId, message,pjId) { //发送群消息
                chatHelphand.recentlyChat(groupId);
                socket.emit("groupMess", {'groupId': groupId, 'message': message, "pjId": pjId,'date': new Date()});
            },
            sendGroudAddUsers: function (groupId, addUsers,pjId) {  //向后台传递添加的成员
                socket.emit("groupAddUsers", {'groupId': groupId, 'addUsers': addUsers, "pjId": pjId });
            },
            sendGroudDelUsers: function (groupId, userId,pjId) {
                socket.emit("groupDelUsers", {'groupId': groupId, 'userId': userId, "pjId": pjId});
            },
            delGroup: function (groupId,pjId) {    //删除群组
                socket.emit("delGroup", {'groupId': groupId, "pjId": mainConfig.projectId});

                //群组获得不到项目id
                var groupWindow = chatHelphand.getGroupWin(mainConfig["projectId"]);
                if (groupWindow) {
                    groupWindow.window.delGroup(groupId);
                }
                notification.checkSignFlag();
                ////群信息窗口
                if (briefGroupInfo) {
                    briefGroupInfo.hide();
                }
            },
            sendNewTask: function (userId, audit) {   // 发送任务
                socket.emit("newTask", {'recipient': userId, 'audit': audit, "pjId": mainConfig.projectId});
            },
            sendOutLine: function () {
                socket.disconnect();
            },
            sendDelGroupUser: function (id) {
                socket.emit("delGroupUser", {"userId": id, "pjId": mainConfig.projectId});
            },
            sendNotice: function () {     //发送通知，让在线用户进行刷新
                socket.emit("newNotice", {"pjId": mainConfig.projectId});
            },
            editGroupInfo: function (groupInfoObj) {  //没有加projectId
                socket.emit("editGroupInfo", groupInfoObj);
            },
            singleChat: function (recipientId, message, projectId) {
                socket.emit("singleChat", {'recipient': recipientId, 'message': message, "pjId": projectId});
            }
        }
    }
    function GroupHelphand(mainConfig, userInfo) {  //主面板群聊天功能
        this.addGroupHand = "#addGroup";
        this.grouNameHand = "#name";
        this.userId = userInfo.id;
        this.level = userInfo.level;
        this.baseUrl = configinfo.server_url;
        this.chineseName =userInfo.chinese_name;
        this.Content = "#li_add_group";
        this.linkGroup = "#linkgroupLayer";
        this.singleFlag = true;    //编辑和新建群组只能有一个的标识
    }
    GroupHelphand.prototype.init = function(projectId){
        this.getUserGroupInfo(projectId);
        this.addGroup();
        this.addGroupEvent();
    };
    GroupHelphand.prototype.addGroup = function () {
        var _self = this;
        $(this.addGroupHand).click(function () {  //新建群
            if(_self.singleFlag) {
                _self.singleFlag = false;
                var $name = $(_self.grouNameHand);
                if (!$name.length) {         //只能有一个创建群的编辑框
                    $('.linkgroupSiteBar').append(_self.addGroupModel());
                    // _self.addGroupEvent();
                    $(_self.grouNameHand).focus();
                } else {
                    $name.focus();
                }
            }
        });

    };
    GroupHelphand.prototype.addGroupEvent = function () {
        var _self = this,
            saveflag = true;//只能保存一次
        $(".linkgroupSiteBar").unbind()
            .on('click', "#deleteGroup", function () {  //删除群
                _self.clearErrMess();
                // $(this).remove();
                $('.new-group').parents("li").remove();
                _self.singleFlag = true;
            })
            .on('click', "span#ensureGroup", function () {
                var groupName = $(_self.grouNameHand).val(),
                    userId = _self.userId,
                    groupImage = "images/dafaultgroup.png",
                    userName = _self.chineseName,
                    createTime = new Date(),
                    $parentLi = $(this).parents("li");
                if (!$.trim(groupName)) {
                    _self.errorMess("请输入名称！");
                    $("#name").focus();
                    return false;
                }
                if (saveflag) {
                    saveflag = false;
                    _self.saveGroupInfo(groupName, userId, userName, groupImage, createTime, function (data) {
                        var $group = $("#" + data.values.id);
                        if ($group && $group.length) return;
                        _self.groupView(data.values.id, data.values.name, data.values);
                        $parentLi.remove();
                        _self.singleFlag = true;
                        saveflag = true;
                    }, function () {
                        $parentLi.remove();
                    });
                }

                $(this).remove();
            });
    };
    GroupHelphand.prototype.errorMess = function(mess,callback){
        divAlert(mess,1800);
        if(callback){
            callback();
        }
    };
    GroupHelphand.prototype.clearErrMess = function(){
        cleardivAlert();
    };
    GroupHelphand.prototype.saveGroupInfo  = function(groupName,userId,userName,groupImage,createTime,callback,errorFn){
        var _self = this;
        $.ajax({
            type: 'post',
            url:  _self.baseUrl + "/api/group/",
            data: "name=" + encodeURIComponent(groupName) + "&creatorId=" + userId + "&creatorName=" + userName + "&groupImage=" + groupImage + "&attachmentAmount=0&createTime=" + createTime,
            success: function (data) {
                if (data.ok && callback) {
                    callback(data);
                }
            },
            error: function (data) {
                _self.errorMess("群组创建失败!",errorFn);
            }
        });
    };
    GroupHelphand.prototype.addGroupModel = function () {
        return '<li style="list-style: none">' +
            '<div class=\"chat_item chatListGroup new-group\">' +
                '<div class=\"avatar\">' +
                    '<div class=\"avatarBk\">' +
                        '<img class=\"avatar\" src=\"images/avatar.jpg\" alt=\"avatar.png\">' +
                    '</div>' +
                '</div>' +
                '<div class=\"info\">' +
                    '<input class=\"nickname\" placeholder=\"请输入群名称\" id=\"name\" maxlength=\"10\">' +
                    '<div class=\"ext\" style="top: 10px;"><span id=\"ensureGroup\">确定</span><span id=\"deleteGroup\">取消</span></div>' +
                '</div>' +
            '</div></li>';
    };
    GroupHelphand.prototype.groupViewModel = function (grpupId, groupName, groupImage) {
        return "<li ><div class=\"chatListGroup chat_item \" id=\"" + grpupId + "\">" +
            "<div class=\"avatar\">" +
            "<div class=\"avatarBk\" id='PersonalInfoBtn'><img class=\"avatar\" src=\"" + groupImage + "\" alt=\"avatar.png\"></div></div>" +
            "<div class=\"info\"><span class=\"nickname_text\" style=\"display: block;position: relative;\">" + groupName + "</span>" +
            "<div class=\"ext\"><i class=\"iconfont\">&#xe69a;</i><i class=\"iconfont\">&#xe626;</i></div>" +
            "<div class=\"new-tip\"></div>"+
            "</div> " +
            "</div></li>";
    };
    GroupHelphand.prototype.uploadFile = function () {
        var $uploadFile = $("<input type=\"file\" style=\"display:none\">");
        $uploadFile.on("change",function(){
            groupHelphand.checkAndUploadHeadImgFile(this.files[0],this);
        });
        return $uploadFile;
    };
    GroupHelphand.prototype.delGroup = function (groupId,$this) {
        var _self = this;
        if(_self.singleFlag) {
            $.ajax({
                type: 'delete',
                url: _self.baseUrl + "/api/group/" + groupId,
                success: function (data) {
                    if (data.ok) {
                        chatHelphand.recentlyRemov(groupId);
                        getEmitMes().delGroup(groupId);
                        $this.parents("li").remove();
                    }
                },
                error: function (data) {
                    console.log("删除失败")
                }
            });
        }
    };
    GroupHelphand.prototype.restoreVal = function(){
        this.singleFlag = true;
    };
    GroupHelphand.prototype.groupView = function (groupId, groupName, groupInfo) {
        var _self = this,
            _$group = null,
            _groupInfo = groupInfo,
            _$addGroup = null;

        var gImg = _self.baseUrl + "/" + ( _groupInfo.image ? _groupInfo.image : "images/dafaultgroup.png");

        if (!$("#" + groupId).length) {
            _$group = $(_self.groupViewModel(groupId, groupName, gImg));
            _$group.children("div").hover(function () {     //控制样式
                $(".current_chat_item").removeClass("current_chat_item");
                $(this).addClass("current_chat_item");
                $(this).parent().siblings().find("div.ext").children("i").hide();
                if (_groupInfo.creatorId == _self.userId) {
                    $(this).find("div.ext").children("i").show();
                }
            }, function () {
                $(this).removeClass("current_chat_item");
                if (_groupInfo.creatorId == _self.userId) {
                    $(this).find("div.ext").children("i").hide();
                }
            });

            _$group.find("#" + groupId).attr("name",groupId).attr("groupInfo",JSON.stringify(groupInfo)).on("dblclick", function () {
                var thisId = $(this).attr("id");
                _self.groupMess_readFlag($(this));
                _self.groupMess_readFlag($("#" + thisId + "_Recently"));
                notification.groupRemoveSignFlag();
                MessageHandle.localStoDel("_unRead_" + mainConfig["projectId"],thisId);
                getGuiWindow().openGroupWindow(JSON.parse($(this).attr("groupinfo")));
                return false;
            });

            _$group.find("div.ext").attr("gpId", groupId);
            if (_groupInfo.creatorId == _self.userId) {  //修改群头像的操作
                _$group.find("div#PersonalInfoBtn").append(_self.uploadFile())
                    .children("img").click(function () {
                    briefGroupInfo.hide();
                    $(this).next().click();
                });

                //修改群名称与删除群的操作
                _$group.find("div.ext").children("i").click(function (e) {
                    e.stopPropagation();
                    var $this = $(this),
                        id = $this.parent().attr("gpId");
                    if ($(this).index()) {      //删除群组的操作
                        _self.delGroup(id,$this);
                    } else {   //修改名字的操作
                        _self.editGroup($(this));
                    }
                });
            }

            _$group.find("div.ext").children("i").hide();
            _$addGroup = $(_self.Content);

            if (_$addGroup.length) {
                _$addGroup.before(_$group);
            } else {
                $(_self.linkGroup).children("ul.linkgroupSiteBar").append(_$group);
            }
            _self.AddGroupPannel(_$group, groupId,groupInfo);
        }
    };
    GroupHelphand.prototype.editModel = function(){
        return "<input type=\"text\" class=\"form-control textctl\"  maxlength=\"10\"><div class=\"attrbtn\"><i class=\"iconfont\">&#xe621;</i><i class=\"iconfont\">&#xe638;</i></div>";
    };
    GroupHelphand.prototype.editGroupName = function(groupId,groupName,callback){
        var _self = this;
        $.ajax({
            type: 'put',
            url: _self.baseUrl + "/api/group/" + groupId,
            data: "name=" + encodeURIComponent(groupName),
            success: function (data) {
                if(data.ok && callback){
                    callback(data);
                }
            },
            error: function (data) {
                console.log("修改名字失败")
            }
        });
    };
    GroupHelphand.prototype.editGroup = function($obj){
        var _self = this;
        if(_self.singleFlag) {
            _self.singleFlag = false;
            var $parent = $obj.parents("li"),
                $edit = $($parent.html());

            $edit.find("div.ext").children("i").hide();

            $edit.removeAttr("id");
            $edit.hover(function () {
                $(".current_chat_item").removeClass("current_chat_item");
                $(this).addClass("current_chat_item");
                $(this).find("attrbtn").children("i").show();
            }, function () {
                $(this).find("attrbtn").children("i").hide();
                $(this).removeClass("current_chat_item");
            });

            $edit.children("div.info").children("span").html(_self.editModel());
            $edit.children("div.info").children("span").children("input").val($parent.find("span.nickname_text").text());

            //修改图片并绑定相关事件
            //修改群名称
            $edit.find("div.attrbtn").children().eq(0).html('&#xe621;').click(function () {
                var groupName = $edit.children("div.info").children("span").children("input").val(),
                    groupId = $parent.children("div").eq(1).attr("id");

                if (!$.trim(groupName) || !groupId) {
                    _self.errorMess("请输入名称！");
                    return false;
                }
                _self.clearErrMess();
                _self.editGroupName(groupId, groupName, function (data) {
                    if (data.ok) {
                        $parent.children().eq(0).remove();
                        $parent.children().eq(0).show();
                        var groupInfoObj = {"groupId": groupId, "groupName": groupName, "pjId": mainConfig["projectId"]};
                        _self.changeGroupInfo(groupInfoObj, chatHelphand.getGroupWin(mainConfig["projectId"]));   //通知他人进行修改名字
                        getEmitMes().editGroupInfo(groupInfoObj);
                        _self.singleFlag = true;
                    }
                });
            }).end().eq(1).html("&#xe638;").click(function () {
                $parent.children().eq(0).remove().end().eq(1).show();
                _self.singleFlag = true;
            });
            $parent.prepend($edit);
            $parent.children().eq(1).hide();
        }
    };
    GroupHelphand.prototype.AddGroupPannel = function( groupObj, groupId,groupInfo){
        groupObj.find('.avatarBk').on('mouseenter', function () {
            var GroupItemObj = $(this).closest('li');
            var offsetY = GroupItemObj.offset().top;
            //获取面板窗口当前位置
            var mainPannel = mainPannel_config.gui.Window.get();
            var curPos = {};
            curPos.x = mainPannel.x;
            curPos.y = mainPannel.y;

            briefGroupInfo.x = curPos.x - briefGroupInfo.width;
            var briefGroupInfoY = curPos.y + offsetY;
            if (briefGroupInfoY + briefGroupInfo.height > mainPannel.y + mainPannel.height) {
                briefGroupInfoY = briefGroupInfoY - briefGroupInfo.height + GroupItemObj.height();
            }
            briefGroupInfo.y = briefGroupInfoY;
            briefGroupInfo.show();
            briefGroupInfo.window.setGroupInfo(groupId);
        });
        //隐藏
        groupObj.closest('li').on('mouseleave', function () {
            if (briefGroupInfo) {
                briefGroupInfo.hide();
            }
        });
    };
    GroupHelphand.prototype.getUserGroupInfo = function (projectId,callback) {
        $(this.linkGroup).children("ul.linkgroupSiteBar").empty();
        var _self = this;
        $.ajax({
            type: 'get',
            url: _self.baseUrl + "/api/group/getGroupByUser",
            data:"userId="+ _self.userId,
            success: function (data) {
                if (data.ok) {
                    if (data.list && data.list.length) {//大于1
                        $.each(data.list, function (index, val) {
                            if (val) {
                                _self.groupView(val.id, val.name, val);
                            }
                        });
                    }
                    if (callback)
                        callback();
                }
            },
            error: function (data) {
                console.log("获取群消息失败");
            }
        });
    };
    //更改群组的名字  群对象{"groupId":,"groupName":,"groupImg":}
    GroupHelphand.prototype.changeGroupInfo = function changeGroupInfo(groupInfoObj,groupWindow) {//两个操作一起进行
        var groupId = groupInfoObj.
                groupId,
            getGroupWindow = null,
            groupWin = null;

        if (!groupId) return;
        var $groupRecently = $("#" + groupId + "_Recently"),
            $groupId = $("#" + groupId);
        if (groupInfoObj.groupName) {
            var groupName = groupInfoObj.groupName;
            $groupId && $groupId.length && $groupId.find("span.nickname_text").text(groupName);
            $groupRecently && $groupRecently.length && $groupRecently.find("span.nickname_text").text(groupName);
        }
        if (groupInfoObj.groupImg) {
            var imgUrl = userInfo.configinfo.server_url + "/public/" + groupInfoObj.groupImg;
            if($groupId && $groupId.length) {
                $groupId.find("div.avatarBk").children("img").attr("src", imgUrl);
                getGroupWindow = chatHelphand.getGroupWin(mainConfig.projectId);
            }
            $groupRecently && $groupRecently.length && $groupRecently.find("div.avatarBk").children("img").attr("src", imgUrl);
        }
        groupWin = groupWindow || getGroupWindow;
        if (groupWin) {
            groupWin.window.changeGroupInfo(groupInfoObj);
        }
    };
    //群组未读消息的保存
    GroupHelphand.prototype.groupMess_saveMess = function (mes_key, data) {
        var userMes = localStorage.getItem(mes_key);
        var messObj = {"sender": data.sender, "mess": data.msg, "date": data.date}, oldArr = [];
        if (userMes) {
            oldArr = JSON.parse(localStorage.getItem(mes_key));
            oldArr instanceof Array ? oldArr.push(messObj) : oldArr = [];
            localStorage.setItem(mes_key, JSON.stringify(oldArr));
        } else {          //此处只是简单的存储，没有时间标识
            localStorage.setItem(mes_key, JSON.stringify([messObj]));
        }
        notification.newNoti(data,true);
    };
    //添加未读消息的标记
    GroupHelphand.prototype.groupMess_flag = function ($obj,num) {
        /*if (!$obj.find("div.avatar").hasClass("newmsg")) {
            $obj.find("div.avatar").addClass("newmsg");
        }*/
        var new_tip = $obj.children("div.info").children('div.new-tip');
        if(new_tip.is(':hidden')){
            new_tip.show();

        }
        new_tip.text(num);
    };
    GroupHelphand.prototype.groupMess_readFlag = function (obj) {
        if (obj && obj.length) {
            var new_tip = obj.children("div.info").children('div.new-tip');
            new_tip.hide();
            new_tip.text('');
            // obj.find("div.avatar").removeClass("newmsg");
        }
    };

    GroupHelphand.prototype.checkAndUploadHeadImgFile = function(fileObj,self){
        var headImgInputObj = $(self),
            groupId = headImgInputObj.parents(".chat_member_group").attr("id"),
            _self = this;

        var fileName = headImgInputObj.val();
        if (fileName == "")
            return;

        //检查文件类型
        var exName = fileName.substr(fileName.lastIndexOf(".") + 1).toUpperCase();
        if (exName == "JPG" || exName == "BMP" || exName == "PNG" || exName == "JPEG") {
            //上传图片文件
            var formData = new FormData();             // 创建一个表单对象FormData
            formData.append('file', fileObj);

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    //修改用户头像信息
                    if (xhr.status == 200) {
                        var repObj = JSON.parse(xhr.responseText);
                        repObj.name = repObj.name.replace(/\+/g, '%2B');
                        repObj.name = repObj.name.replace(/\&/g, '%26');
                        //使用新头像
                        $.ajax({
                            type: 'put',
                            url: userInfo.configinfo.server_url + "/api/group/" + groupId,
                            data: 'image=public/' + repObj.name,
                            success: function (data) {
                                if (data.ok) {
                                    var groupInfoObj = {"groupId":groupId,"groupImg":repObj.name};
                                    _self.changeGroupInfo(groupInfoObj);
                                    getEmitMes().editGroupInfo(groupInfoObj);
                                }
                                else {
                                    console.log('修改头像失败');
                                }
                            },
                            error: function (data) {
                                console.log('修改头像失败');
                            }
                        });
                    }
                    else {
                        console.log("头像上传失败");
                    }
                }
            };
            xhr.open('post', userInfo.configinfo.server_url + '/api/file/upload');
            xhr.send(formData);
        }
        else {
            console.log("图片格式错误，支持jpg、bmp、png格式");
        }
    };
    exports.PannelChat = {  //对外暴露的方法
        emit: getEmitMes,
        init: initSocketEvent,
        setUserListOrder: setUserListOrder,
        setProjectId: setProjectId,
        mainPannelChatFn: getGuiWindow,
        addUserFlag: addUserFlag,
        getCloseTime:chatHelphand.getCloseTime,
        notification : notification,
        closeWindowGui : closeWindowGui,
        cleanGroupEdit : restoreVal,
        getDateViewForm : chatHelphand.getDateViewForm,
        pridbClick : chatHelphand.openUserDialog,
        getUsers : chatHelphand.getUsers,
        getRecentlyList : chatHelphand.getRecentlyList
    };

    function restoreVal(){
        groupHelphand.restoreVal();
        $("#name").parents("li").remove();
    }
    exports.personalChat = {    //personalChat 窗口调用的方法
        sentMessage: function (recipientId, message, projectId) {    //userId接收人   message信息
            chatUserHandle.addRecentlyUser(recipientId, true);
            chatHelphand.setChatTime(chatHelphand.getDateViewForm(new Date()), recipientId);
            chatHelphand.setChatTime(chatHelphand.getDateViewForm(new Date()), recipientId + "_Recently");
            chatHelphand.recentlyChat(recipientId);
            getEmitMes().singleChat(recipientId, message, projectId);
        },
        setChildWindow: function (pjId) {
            getGuiWindow().cleanGuiWindow(pjId + "_ChildWindow");
        },
        getChatUserInfo : chatHelphand.getChatUserInfo,
        getUserImageUrl : chatHelphand.getUserImageUrl
    };

    exports.mainContain = {
        getGroupImageUrl :  chatHelphand.getGroupImageUrl,
        getGroupName : chatHelphand.getGroupName,
        getChatUserInfo : chatHelphand.getChatUserInfo,
        sendGroupMess : getEmitMes().sendGroupMess,
        getGroupUser : getEmitMes().getGroupUser,
        sendGroudAddUsers : getEmitMes().sendGroudAddUsers,
        sendGroudDelUsers : getEmitMes().sendGroudDelUsers,
        setChildWindow: function (pjId) {
            getGuiWindow().cleanGuiWindow(pjId + "_GroupWindow");
        },
        updateUserUrl:function(userUrl){
            $.each(mainPannel_config.guiObj,function(index,val){
                val.window.changeUserImage(userUrl);
            });
        }
    };
})(window,jQuery);