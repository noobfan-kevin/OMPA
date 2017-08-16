/**
 * Created by an_itcast@163.com on 2015/12/29.
 * 群聊天的代码
 */
var mainWindow = null,
    userInfo=JSON.parse(localStorage.getItem("userInfo")),
    chatGroups = [],
    groupUsersList = [],
    isfocus=true,
    notaddGroup=false,
    record_date=fileope.getDate(),
    currentPage = 1,
    projectId = -1,
    oneDayFlag = false,
    select_oneDay = '',
    pageCount_history = 0;
    var gui = require('nw.gui'),
        win = gui.Window.get();

$(function() {
    getGroupUser($("#talkgroup").children(".setopacity").attr("id"));
    fileope.fileUpload(true);
    // remark.init("group");
    $("#closs_div").click(closeWindow);
    $("#mix_div").click(minimizeWindow);
    $("#suredialog").click(function (e) {    //确定添加的群成员
        e.stopPropagation();
        var selectOpt = $("#memberdialog-content").find("div.selectIcon"),
            selectArr = [],
            groupId = $("#talkgroup").children(".setopacity").attr("id"),
            addUserInfo = {},
            id;

        $.each(selectOpt, function (index, val) {
            id = $(val).attr("id");
            selectArr.push(id);
            addUserInfo[id] = $(this).parent().find(".nickname").text();
        });
        var $membCon = $(".memberdialog-content");
        if (!$membCon.hasClass("hide")) {
            $membCon.addClass("hide");
            $('.add-member').hide();
        }
        if(selectArr.length) {
            ////向数据库中添加群成员
            $.ajaxSetup({
                beforeSend: function (xhr, setting) {  //设置Header
                    xhr.setRequestHeader('sid', localStorage.getItem('sid') || 0);
                },
                cache: false,
                crossDomain: true
            });

            $.ajax({
                type: 'post',
                url: userInfo.configinfo.server_url + "/api/group/" + groupId,
                data: "members=" + JSON.stringify(selectArr),
                success: function (data) {
                    mainWindow.window.mainContain.sendGroudAddUsers(groupId, JSON.stringify(addUserInfo), projectId);
                    getGroupUser(groupId);
                },
                error: function (data) {
                    console.log("添加群成员失败");
                }
            });
        }
    });

    //显示隐藏右侧面板
    //显示隐藏右侧面板

    $("#cutbtn").click(function(){
        var _this = this;
        if($(".right_Contain").is(":hidden")) {
            win.resizeTo(892,600);
            $(".hd_member").css("margin","0 13px");
            setTimeout(function(){
                $(_this).attr("src","images/recordstretch.png");
                $(".right_Contain").show();
                if(!$(".add.historyfy.remarkicon").is(":hidden")){
                    $("i.iconfont.closeRemark").triggerHandler("click");
                }
                $(".left_Contain").addClass("left_Contain_1").removeClass("left_Contain");
                $("#groupinfolayer_member").show();
                ////获得群成员
                /*getGroupUser($("#talkgroup").children(".setopacity").attr("id"));*/
                //填充空白聊天分组
                fillBlankChatGroup();
                $(".move_div").addClass("move_div_rightshow");
                $("#history_list").show();
                readerHistory(1);
                /*var $myTab = $("#myTab"),$history_list = $("#history_list");
                if($myTab.children().eq(0).hasClass("setopacity")) {
                    $history_list.show();
                    readerHistory(1);
                }*/
                /*if($myTab.children().eq(1).hasClass("setopacity")) {
                    $("#member_list").show();
                }else {
                    $("#member_list").hide();
                }*/
            },25);
        }
        else {
            $(_this).attr("src","images/recordshrink.png");
            $(".right_Contain").hide();
            $(".left_Contain_1").addClass("left_Contain").removeClass("left_Contain_1");
            $("#groupChat_history").removeAttr("style");
			$(".move_div").removeClass("move_div_rightshow");
            win.resizeTo(592,600);
        }
    });
    //历史消息的按钮
    $("#groupChat_history").click(function () {
        var $this = $(this);
            readerHistory(1);
            $this.parent().addClass("setopacity setbottomstyle");
    });

    $("#add_face_btn").children("a").click(function(){
        var className = $(this).attr("class");
        switch (className) {
            case "btn_text":
            {
                var $chat_tex = $("#chackTextarea-area"),
                    mesg = $chat_tex.html(),
                    groupId = "";

                mesg = replaceText(mesg);
                $chat_tex.empty();
                if (!mesg.replace(/[\s\uFEFF\xA0]/g, "") || !mesg.replace(/&nbsp;/ig, "")) {
                    notaddGroup = true;
                    return;
                }

                mesg = changeImage(mesg);
                //后面追加信息
                groupId = $("#talkgroup").children(".setopacity").attr("id");
                if ($("#" + groupId).hasClass("setopacity")) {  //非离线消息
                    mainWindow.window.mainContain.sendGroupMess(groupId, mesg, projectId);
                }
                $chat_tex.css({"height": '40', 'overflowY': 'hidden'});
                $("#facebox").hide();

                break;
            }
        }
        return false;
    });
    $("#addGroupFile").on("click",function(){
        $(this).parent("div.add").next().click();
    });

    $("#groupinfolayer_history").children(".iconfont").eq(2).hover(function(){
        if(currentPage >= pageCount_history){
            $(this).css("color","#807272");
        }else{
            $(this).removeAttr("style");
        }
    },function(){
        if(pageCount_history > currentPage){
            $(this).removeAttr("style");
        }
    }).end().eq(3).hover(function() {
        if (currentPage <= 1) {
            $(this).css("color", "#807272");
        } else {
            $(this).removeAttr("style");
        }
    },function() {
        if (currentPage > 1) {
            $(this).removeAttr("style");
        }
    });
});

var mainWindowFn = {
    setMainWindow : function (main,proId,proName) {
        mainWindow = main;
        projectId = proId;
        $("div.hd-head").children("h4").text(proName);
        chatHistorys.init();
    },
    //好友上下线
    upOrDown_line : function (id,upOrDown) {//用户id  上线为true，下线为false
        var $user = $("#" + id);
        if ($user.length) {
            if (upOrDown) {
                $user.removeClass("desaturate");
                groupUsersListSort_onLine(id);
            } else {
                $user.addClass("desaturate");
                groupUsersListSort_offline(id);
            }
        }
    },
    cleanMainWind : function(){
        saveCloseTime(JSON.stringify(chatGroups),userInfo.configinfo.server_url,userInfo.id); //保存最后聊天的时间
        if (mainWindow)
            mainWindow.window.mainContain.setChildWindow(projectId);
        cleanLocalStorage(chatGroups);
    }
};
//读取用户记录
function readerHistory(pagination) {
    var groupId = $("#talkgroup").children("div.setopacity").attr("id");
    chatHistorys.paging_groupChat(groupId, pagination, function (data) {
        readerData_dispose(data,pagination);
    });
}
// 读取某一天的历史记录
function readerHistory_oneDay(date,pagination){
    var groupId = $("#talkgroup").children("div.setopacity").attr("id");
    chatHistorys.paging_groupChat_oneDay(groupId, pagination || 1,date,function (data) {
        readerData_dispose(data,pagination);
    });
}

function readerData_dispose(data,pagination){
    var senderArr = {},
        senderInfo = null,
        message = '',
        userName = '';
    pageCount_history = data.pageCount;
    if(0 < pagination && pagination <= pageCount_history) {
        $("#historyrecord").empty();
    }else{
        currentPage = pagination > pageCount_history ? pageCount_history : 1;
        return false;
    }

    if (data && data.data.length>0) {
        $.each(data.data, function (index, val) {//遍历聊天信息，每页显示的量在chatHistory中控制
            if (!senderArr[val.sender]) {
                senderArr[val.sender] = JSON.parse(getSenderUserInfo(val.sender));
            }
            senderInfo = senderArr[val.sender];
            message=val.message;
            userName = senderInfo.chinese_name ||  senderInfo.name;
            if(message.indexOf("file___")>=0){//文件特殊处理
                message = fileope.getFileRecord(message,val.id,val.date);
            }
            var userImage = mainWindow.window.mainContain.getGroupImageUrl(val.sender) || userInfo.configinfo.server_url +"/"+senderInfo.image;
            addHistoryList(userImage, userName , message, new Date(val.date).toLocaleString(),userInfo.id == val.sender);
        });
    } else {
        console.log("无数据不遍历");
    }
}

//添加用户列表
function addHistoryList(userImg,name,message,date,flag) {
    var userlevel = fileope.getProjectLevel(),
        flagClass = flag ? "avatar avatarMe" : "avatar";

    var historyLi = $("<li><div class=\"chatRecord chat_item\">" +
        "<div class=\"avatar\"><div class=\"avatarBk\">" +
        "<img class='" + flagClass + "' src=" + userImg + " alt=\"avatar.png\"></div></div>" +
        "<div class=\"chatinfo\"><span class=\"chat_name\">" + name + "</span><span class=\"chat_date\">" + date + "</span>" +
        "<div class=\"chat_text\"><span style='word-break: break-all;'>" + message + "</span></div></div></div></li>");
    $("#historyrecord").append(historyLi);
    /*if (userlevel !== "1" && userlevel !== "2" && userlevel !== "3") {
        var historyLi = $("<li><div class=\"chatRecord chat_item\"><div class=\"chb\"><img style=\"display:none;\" src=\"images/black.png\" onclick=\"remark.selectNode(this)\"></div>" +
            "<div class=\"avatar\"><div class=\"avatarBk\">" +
            "<img class='" + flagClass + "' src=" + userImg + " alt=\"avatar.png\"></div></div>" +
            "<div class=\"chatinfo\"><span class=\"chat_name\">" + name + "</span><span class=\"chat_date\">" + date + "</span>" +
            "<div class=\"chat_text\"><span style='word-break: break-all;'>" + message + "</span></div></div></div></li>");
        $("#historyrecord").append(historyLi);
    }
    else {
        var historyLi = $("<li><div class=\"chatRecord chat_item\"><div class=\"chb\"><img src=\"images/black.png\" onclick=\"remark.selectNode(this)\"></div>" +
            "<div class=\"avatar\"><div class=\"avatarBk\">" +
            "<img img class='" + flagClass + "' src=" + userImg + " alt=\"avatar.png\"></div></div>" +
            "<div class=\"chatinfo\"><span class=\"chat_name\">" + name + "</span><span class=\"chat_date\">" + date + "</span>" +
            "<div class=\"chat_text\"><span style='word-break: break-all;'>" + message + "</span></div></div></div></li>");
        $("#historyrecord").append(historyLi);
    }*/
}

/*****************界面上部分，聊天的群对象*****************/
    //添加聊天群组
    //入口：在主面板中双击群，在此面板中添加群信息
viewUser = 7;
v_width = 76*viewUser;
function addTalkGroup(groupInfo,pjId){
    $(".memberdialog-content").addClass("hide");

    $("#chackTextarea-area").css("height",'40').empty();
    if(notaddGroup)
    {
        notaddGroup=false;
        return;
    }
    var groupId = groupInfo.id,
        $thisUser =$("#"+groupId);
    chatGroups.push(groupId);   //关闭窗口时使用

    if(checkUserExist(groupId)){ //窗口已经打开聊天页面的情况

        var content_list = $("div.hd_warp_list");
        var i = viewUser;     //获取界面当前显示的图片个数
        var len = $("div.hd_warp").find(".hd_member").length;
        userlist_page = Math.abs(Math.ceil(parseInt(content_list.css("left").slice(0,-2))/v_width))+ 1;
        page_count = Math.ceil(len / i);   //只要不是整数，就往大的方向取最小的整数
        var gapPageCurrPage = setopa_currPage = Math.ceil((content_list.find(this.setopacity).index() + 1) / i);

        if(userlist_page >=1 && userlist_page != setopa_currPage && userlist_page<=page_count) {
            gapPageCurrPage = userlist_page;
        }

        var userGapPage = Math.ceil(($thisUser.index()+1)/i)-gapPageCurrPage;//焦点用户和目标用户的间隔页码数
        var thisUser_left = $thisUser.offset().left;

        if(thisUser_left<0 || thisUser_left > 500){ //双击的用户是否在当前页面中
            var symbol = userGapPage > 0 ? '-=' : '+=';
            if(userGapPage == 0 && thisUser_left>500) {
                userGapPage = Math.ceil(($thisUser.index() + 1) / i) - (Math.abs(Math.ceil(parseInt(content_list.css("left").slice(0, -2)) / v_width)) + 1);
                symbol = '-=';
            }
            if(userGapPage == 0 && thisUser_left <0 ){
                userGapPage = (Math.abs(Math.ceil(parseInt(content_list.css("left").slice(0, -2)) / v_width)) + 1) -Math.ceil(($thisUser.index() + 1) / i);
                symbol = '+=';
            }
            content_list.animate({left: symbol + Math.abs(v_width * userGapPage)}, "slow");
        }
        $thisUser.triggerHandler("click");
    }else {//窗口没有打开聊天的页面

        $("div.hd_warp_list").animate({left: 0 }, "slow");
        var serverUrl =userInfo.configinfo.server_url,
            $new_user = $("<div id=" + groupId + " class='hd_member setopacity'>" +
            "<div class=\"avatarBk\"><img src="+mainWindow.window.mainContain.getGroupImageUrl(groupId)+" class=\"avatar\">" +
            "</div><p class=\"nickname\">" + mainWindow.window.mainContain.getGroupName(groupId) + "</p>" +
            "<div class=\"close_avatar\"><i class=\"iconfont\">&#xe63d;</i></div></div>");

        saveMess();
        $new_user.attr("gpInfo",groupInfo);
        $new_user.find(".close_avatar").click(function () {
            saveCloseTime(JSON.stringify([groupId]),serverUrl,userInfo.id);
            arrSplice(chatGroups, groupId);
            if ($new_user.hasClass("setopacity")) {

                if ($new_user.next().length) {//获得焦点的
                    $new_user.next().triggerHandler("click");
                } else {
                    if($new_user.offset().left<76 && !$new_user.next().length){
                        $new_user.siblings().eq(0) && $new_user.siblings().eq(0).triggerHandler("click");
                        $("span.prev").triggerHandler("click");
                    }else{
                        $new_user.prev().length && $new_user.prev().triggerHandler("click");
                    }
                }
            }else{//未获得焦点的
                if($new_user.offset().left<76 && !$new_user.next().length){
                    $("span.prev").triggerHandler("click");
                }
            }

            $new_user.remove();
            checkUserNumber($("#talkgroup"));
        });
        $new_user.click(function () {
            var group_id = $(this).attr("id");
            getGroupUser(group_id);
            if($(this).hasClass('setopacity')){
                // 当前窗口显示隐藏群成员列表控制
                $('.box_mid').toggle();
                if($('#myTab').children().eq(0).hasClass("setopacity")) {
                    $("#member_list").show();
                }else {
                    $("#member_list").hide();
                }
            }
            else {
                //点击后  保存数据，替换焦点，显示切换前的数据
                $('.box_mid').hide();
                currentPage = 1;
                select_oneDay = '';
                saveMess();
                // var group_id = $(this).attr("id");
                $("#"+group_id).children("div.avatarBk").removeClass("newmsg");
                $(this).siblings().removeClass("setopacity").end().addClass("setopacity");
                // getGroupUser(group_id);
                showOldMess(group_id);
                getOfflineMess(group_id);//获得离线消息
                win_focus_befor_mess(group_id); //显示历史记录

                if($("#groupChat_history").css("opacity")==1){
                    $("#historyrecord").empty();
                    readerHistory(1);
                }
                $("#chackTextarea-area").css("height",'40').empty();
                $("div.box_bd").scrollTop(getMessHeight());
            }

        });
        $new_user.hover(function(){
            $(this).find(".close_avatar").show();
        },function(){
            $(this).find(".close_avatar").hide();
        });
        $("#talkgroup").children().removeClass("setopacity").end().prepend($new_user);

        getGroupUser(groupId);
        showOldMess(groupId);
        getOfflineMess(groupId);//获得离线消息

        win_off_mess(groupId);
        if($("#groupChat_history").css("opacity")==1){
            $("#historyrecord").empty();
            readerHistory(1);
        }
        if(win) {
            win.removeAllListeners().on('focus', function () {
                isfocus = true;
            });
            win.removeAllListeners().on('blur', function () {
                isfocus = false;
            });
        }
    }
}

/******************消息的处理*****************************/
    //获得离线消息   主面板登陆时获得离线数据
function getOfflineMess(id) {
    var messArr = JSON.parse(localStorage.getItem("noRead_mess"+projectId+userInfo.id));
    if (messArr) {
        var messVal = messArr[id];
        if (!messVal)return;
        if(messVal.sort) {
            messVal.sort(function (prevObj, nextObj) {
                return new Date(prevObj["time"]) - new Date(nextObj["time"]);
            });
        }
        if (messVal instanceof Array) {
            var records = [];
            $.each(messVal, function (attrName, val) {
                receiveMessage(val.message, val.receiverId, val['time'], false, val.receiverId);
            });
        }
        delete messArr[id];
        localStorage.setItem("noRead_mess"+projectId+userInfo.id, JSON.stringify(messArr));//保存取出后的
    }
}

//取出未打开窗口时接收的数据
//状况：用户在线，但聊天面板中没有此聊天窗口
function win_off_mess(groupId) {
    var key = "Win_off_mess_" + groupId;
    var win_off_mess = JSON.parse(localStorage.getItem(key));
    if(!win_off_mess) return;

    if(win_off_mess.sort) {
        win_off_mess.sort(function (prveObj, nextObj) {
            return parseInt(prveObj.date) - parseInt(nextObj.data);
        });
    }
    $.each(win_off_mess, function (index, val) {
        receiveMessage(val.mess, val.sender, val['date'], true,val.sender);
    });
    localStorage.removeItem(key);
}

//未获得焦点前收到的信息
//状况：聊天面板中有此聊天窗口，但不是正在聊天的群
function win_focus_befor_mess(groupId) {
    var key = "win_focus_befor_mess_" + groupId;
    var win_off_mess = JSON.parse(localStorage.getItem(key));
    if (win_off_mess instanceof Array) {
        $.each(win_off_mess, function (index, val) {
            receiveMessage(val.mess, val.sendName, val.date, false, val.sender,true);
        })
    }
    localStorage.removeItem(key);
}

//有新消息时，主面板会调用此方法来接收消息
function receiveGroupMess(data){
    var groupId = data.groupId,
        sender = data.sender,
        message = data.msg,
        sendName = data.sendName,
        date = data.hasOwnProperty("time") ? data['time'] :data["date"];
        $sender=$("#"+groupId);
    if($sender.hasClass("setopacity")){
        receiveMessage(message, sendName,date,false,sender);
    }else {
        $sender.children("div.avatarBk").addClass("newmsg");
        //对数据进行保存
        var messObj = {"sender": sender, "sendName": sendName, "mess": message, "date": new Date(date)},
            mes_key = "win_focus_befor_mess_" + groupId;

        var userMes = localStorage.getItem(mes_key);
        if (userMes) {
            oldArr = JSON.parse(localStorage.getItem(mes_key));
            oldArr instanceof Array ? oldArr.push(messObj) : oldArr = [];
            localStorage.setItem(mes_key, JSON.stringify(oldArr));
        } else {
            localStorage.setItem(mes_key, JSON.stringify([messObj]));
        }
    }
}

function receiveGroupMess_me(data){
    var groupId = data.groupId,
        message = data.msg,
        date = data.hasOwnProperty("time") ? data['time'] :data["date"];
    sendMess(groupId, message,date);
    if(message.indexOf("file___")<0) {
        chatHistorys.addGroupChat(groupId, userInfo.id, message, date);
    }
}

//接收消息的格式，包括用户图片等信息
var queueTime = [];
function receiveMessage(message, sendName,date,isnosave,sender,noti_flag) {
    if (!sender) return;
    var dateTime = !!date ? new Date(date).getTime() : new Date().getTime();

    var flag = true;
    $.each(queueTime,function(index,val) {
        if (val == dateTime) {
            flag = false;
        }
    });

    if(flag) {
        queueTime.push(dateTime);
        var chat_time = !!date ? new Date(date).toLocaleString() : new Date().toLocaleString(),
            chatUserInfo = JSON.parse(getSenderUserInfo(sender));

        var groupId2 = $("#talkgroup").children(".setopacity").attr("id");
        var messageId = chatHistorys.addGroupChat(groupId2, sender, message, date),
            userName = chatUserInfo.chinese_name || chatUserInfo.name;
        message = fileope.createFilediv(message, JSON.stringify({id: messageId, filename: ""}));

        if (message.indexOf("alt=\"Pluto.jpg\"/") < 0) {
            htmlstr = "<div class=\"chat_content_group you\"><p class=\"time\">" + chat_time + "</p>" +
                "<div class=\"avatarBk\">" +
                "<img src=" + userInfo.configinfo.server_url + "/" + chatUserInfo.image + " class=\"avatar\" >" +
                "<span class=\"name\">" + userName + "</span></div> " +
                "<h3 class=\"chat_content\">" + message + "</h3>" +
                "</div>";
        }
        else {
            htmlstr = "<div class=\"chat_content_group you\"><p class=\"time\">" + chat_time + "</p>" +
                "<div class=\"avatarBk\"><img src=" + userInfo.configinfo.server_url + "/" + chatUserInfo.image + " class=\"avatar\" >" +
                "<span class=\"name\">" + userName + "</span></div> <h3 class=\"chat_img\">" + message + "</h3></div>";
        }
        var $receiveMes = $(htmlstr);
        sendAndReceiveMessForm($receiveMes);
        //if(!noti_flag) {
        //    notifyInfo();
        //}

        chatHistorys.checkGroupChat(dateTime, function (count) {
            if (!count) {
                $.each(queueTime, function (index, val) {
                    if (val == dateTime) {
                        queueTime.splice(index, 1);
                    }
                });

                if(queueTime.length == 3000){
                    queueTime = [];
                }
            }else{
                $("div.box_bd").remove($receiveMes);
            }
        });
    }

}
//当窗口没有焦点是弹出提示信息
var myNotification = null ;

function getIsFocus(){
    return isfocus;
}
//function notifyInfo(groupName) {
//    if (!isfocus) {
//        if(myNotification){
//            myNotification.close();
//        }
//
//        myNotification = new Notification(groupName || "新消息", {
//            body: "有新的消息",
//            icon: "images/logo.png"
//        });
//        myNotification.onclick = function () {
//            win = gui.Window.get();
//            if(win) {
//                win.focus();
//            }
//        }
//    }
//}

//获得发送消息人的基本信息
function getSenderUserInfo(sender) {
    return mainWindow.window.mainContain.getChatUserInfo(sender);
}

//清除群消息
function cleanMess(){
    var $div_box_bd = $("div.box_bd");
    $div_box_bd.empty();
}
//保存消息并清除
function saveMess() {
    var $div_box_bd = $("div.box_bd");
    localStorage.setItem($(".hd_member.setopacity").attr("id"), $div_box_bd.html());
    $div_box_bd.empty();
}


/**********群右侧面板*************/
/******群成员********/

    //切换群的聊天对象时，更新右侧成员列表
    //处理方式：若打开则刷新，否则不做处理
function groupUserRefresh(data){
    if(!$(".right_Contain").is(":hidden")){
        if($("#"+data.groupId).hasClass("setopacity")){
            mainWindow.window.mainContain.getGroupUser(data.groupId,projectId);
        }
    }
}

//调用主面板的方法来获取群成员，群的成员信息中会标识是否在线
function getGroupUser(groupId) {
    // if (!$("#member_list").is(":hidden")) {
        if (groupId) {
            mainWindow.window.mainContain.getGroupUser(groupId);
            ContainFile.fileList();
        }
    // }
}

//获得群组成员
var grouData = {},
    grCreatorId = null;
function getGroupInfo(data) {
    var $memList = $("#member_list");
    $memList.children(".chatSiteBar").empty();
    $addGroupMem = $("#addGroupMembers");

    var groupId = $("#talkgroup").children("div.setopacity").attr("id");
        grCreatorId = grouData[groupId] = data.groupInfo.creatorId;

    if(grCreatorId == userInfo.id) {
        if($addGroupMem && !$addGroupMem.length) {
            var $addGroupMem = $('<div class="add"><div class="" id="addGroupMembers">' +
            '<span>添加成员</span><span><i class="iconfont">&#xe62f;</i></span></div></div>');
            $addGroupMem.find("#addGroupMembers").click(function (e) {
                e.stopPropagation();
                $("div.memberdialog-content").show().removeAttr("style");
                getMembers();
            });
            $memList.prepend($addGroupMem);
        }
    }else{
        $memList.css("bottom",0);
        if($addGroupMem && $addGroupMem.length) {
            $addGroupMem.parent().remove();
        }
    }
    //遍历成员并显示
    var dataGroupInfo = data.groupInfo,
        dataGroupArr = [];
    $.each(dataGroupInfo,function(key,val){
       if(key != "creatorId"){
           val._id=key;
           dataGroupArr.push(val);
       }
    });
    dataGroupArr.sort(function(prveObj,nextObj) {
        return nextObj.name.localeCompare(prveObj.name);
    });

    $.each(dataGroupArr, function (id, val) {
        var userid = val.id ? val.id : id,
            isonline = !!val.isonline,
            userName = val.name,
            userImg = mainWindow.window.mainContain.getGroupImageUrl(userid) || userInfo.configinfo.server_url + "/" + val.userImg;
        addGroupUser(userid, userName, isonline, userImg,grCreatorId);
        groupUsersList.push(userid);        //排序依赖的顺序
        fillBlankChatGroup();
    });

    groupUsersList.reverse();
    $.each(groupUsersList, function (id, val) {
        if (!$("#" + val).hasClass("desaturate")) {
            groupUsersListSort_onLine(val);
        }
    });
    //$memList.hide();
}
//获取要添加的成员
function getMembers(){
    var serverUrl= userInfo.configinfo.server_url,
         $memCont = $("#memberdialog-content");
         $memCont.empty();
    $.ajax({
        type : 'get',
        url : serverUrl+"/api/group/membersGroup/"+$("#talkgroup").children(".setopacity").attr("id"),
        success : function(data) {
        var memberCount = 0,
            $emptyHtml = null,
            $contList = null;
            data.list.sort(function(prevObj,nextObj){
                return prevObj.name.localeCompare(nextObj.name);
            });
            if(data.list.length!==0){
                $.each(data.list,function(index,val) {
                    $contList = $("<div class=\"contactList\"></div>");
                    memberCount++;
                    $userSingleRow = $("<div class=\"contact_item chat_item\" >" +
                    "<div class=\"avatar\"><div class=\"avatarBk\">" +
                        "<img class=\"avatar\" src=" + serverUrl + "\/" + val.image + " alt=\"avatar.png\"/></div></div>" +
                    "<div class=\"info\"><span class='nickname'>" + val.name + "</span></div>" +
                        "<div class=\"icon-file\" id = " + val.id + "><i class='iconfont'>&#xe68d;</i></div></div>");

                    $userSingleRow.click(function (e) {
                        e.stopPropagation();
                        var $imgSrc = $(this).find("div.icon-file"),
                            $i = $(this).find("div.icon-file").children('i');

                        if($imgSrc.hasClass('selectIcon')){
                            $imgSrc.removeClass("selectIcon");
                            $imgSrc.html('<i class="iconfont">&#xe68d;</i>');
                        }else{
                            $imgSrc.addClass("selectIcon");
                            $imgSrc.html('<i class="iconfont selectIcon">&#xe68a;</i>');
                        }
                    });
                    $contList.append($userSingleRow);
                    $memCont.append($contList);
                });
                /*if(memberCount<8){
                    for(var j = 0;j<8-memberCount;j++){
                        $emptyHtml = $("<div class=\"contactList\"><div class=\"contact_item chat_item\" ></div></div>");
                        $contList.append($emptyHtml);
                    }
                }*/
            }else{
                for(var i =1 ;i<8;i++){
                    $emptyHtml = $("<div class=\"contactList\"><div class=\"contact_item chat_item\" ></div></div>");
                    $memCont.append($emptyHtml);
                }
            }
            $(".memberdialog-content").removeClass("hide");
            $(".add-member").show();
        },
        error:function(data){
            console.log("获取用户失败");
        }
    });
}

//添加群组成员
function addGroupUser(userid,userName,isonline,userImg,grCreaId) {
    var $memList = $("#member_list").children(".chatSiteBar");
    var className = isonline ? "chat_item chatListGroup" : "chat_item chatListGroup desaturate";

    var userLi = $("<li ><div id=" + userid + " class='" + className + "'>" +    
    "<div class=\"avatar\"><div class=\"avatarBk\"><img class=\"avatar\"  alt=\"avatar.png\" src=\"" + userImg + "\"/></div>" +
        "<div class=\"close_avatar\"><i class=\"iconfont\">&#xe63d;</i></div></div>" +
    "<div class=\"info\"><span class=\"nickname\">" + userName + "</span></div></div></li>");

    var $delExt = userLi.find(".close_avatar");
        $delExt.hide();
    if (grCreaId == userInfo.id && userid != userInfo.id) {
        $delExt.children("i").click(function () {
                var parLi = $(this).parents("div.chatListGroup"),
                    userId = parLi.attr("id"),
                    groupId = $("#talkgroup").children("div.setopacity").attr("id");

                $.ajaxSetup({
                    beforeSend: function (xhr, setting) {  //设置Header
                        xhr.setRequestHeader('sid', localStorage.getItem('sid') || 0);
                    },
                    cache: false,
                    crossDomain: true
                });
                $.ajax({
                    type: 'put',
                    url: userInfo.configinfo.server_url + "/api/group/members/" + groupId,//群组id
                    data: "userId=" + userId,
                    success: function (data) {
                        mainWindow.window.mainContain.sendGroudDelUsers(groupId, userId,projectId);
                        mainWindow.window.mainContain.getGroupUser(groupId, projectId);
                        userLi.remove();
                    },
                    error: function (data) {
                        console.log("删除群组成员失败");
                    }
                });

            });
    } else {
        userLi.find(".close_avatar").remove();
    }
    //群成员鼠标移上去，字体变色，删除按钮出现
    userLi.on('mouseover', function () {
        $(".current_chat_item").removeClass("current_chat_item");
        $(this).addClass("current_chat_item");
        if (grCreaId && grCreaId == userInfo.id) {
            $delExt.show();
        }
    });
    userLi.on('mouseleave', function () {
        $(this).removeClass("current_chat_item");
        if (grCreaId && grCreaId == userInfo.id) {
            $delExt.hide();
        }
    });

    //群文件鼠标移上去，字体变色，下载按钮出现
    userLi.on('mouseover', function () {
        $(".current_chat_item").removeClass("current_chat_item");
        $(this).addClass("current_chat_item");
        $(this).find(".icon-file img").attr("src", "images/ico-file.png");
        $(this).siblings("li").find(".icon-file img").attr("src", "images/ico-file_purple.png");
    });

    //群文件鼠标移上去，字体变色，下载按钮出现
    userLi.on('dblclick', function (e) {
        e.stopPropagation();
        mainWindow.window.PannelChat.pridbClick(userid);
    });
    $memList.prepend(userLi);
}

//群成员被移除
function groupClose(data) {
    $("#" + data.groupId).find(".close_avatar").triggerHandler("click");
}

//用户列表在线的排序
function groupUsersListSort_onLine(userId) {
    var     $userId = $("#" + userId),
        $queueFront = null,
        $parentId = $("#member_list").children(".chatSiteBar"),
        arrIndex = groupUsersList.indexOf(userId);
    $.each(groupUsersList, function (index, val) {
        if (index == arrIndex) {
            return false;
        }
        var $self = $("#" + val);
        if($self && $self.length) {     //有对象再执行
            if (!$self.hasClass("desaturate")) {
                $queueFront = $self;
            }
        }
    });
    null == $queueFront ? $parentId.prepend($userId.parent("li")) : $queueFront.parent("li").after($userId.parent("li"));
}

//用户列表离线的排序
function groupUsersListSort_offline(userId) {
    var $userId = $("#" + userId),
        $parentId =  $("#member_list").children(".chatSiteBar"),
        $queueFront = null,
        queueFront_index = 0;
    $userId.addClass("desaturate");

    if(groupUsersList) {
        var arrIndex = groupUsersList.indexOf(userId);
    }
    $.each(groupUsersList, function (index, val) {
        var $self = $("#" + val);
        queueFront_index = index;
        if (index == arrIndex) {
            if ($queueFront)
                return false;
        }
        if ($self.hasClass("desaturate")) {
            $queueFront = $self;
            if (index > arrIndex) return false;
        }
    });
    null == $queueFront ? $parentId.append($userId.parent("li")) :queueFront_index > arrIndex? $queueFront.parent("li").before($userId.parent("li")):$queueFront.parent("li").after($userId.parent("li"));
}
/**************其它*****************/
    //断开连接时对群成员的处理
function groupOffLine(){
    var groupUserList = $("#member_list").find(".chat_member_group");
    $.each(groupUserList,function(index,val) {
        if (!$(this).hasClass("desaturate")) {
            $(this).addClass("desaturate")
        }
    });
}

var helpHand = {
    reConnect: function () {   //重新连接
        $("#talkgroup").children(".setopacity").triggerHandler("click");
    }
};


//设置用户信息
function setConfigInfo(info){
    userInfo=info;
}
//删除群组时对应的操作
function delGroup(id) {
    if (!id)return;
    $("#" + id).find(".close_avatar").triggerHandler("click");
}
//切换天数
function changeRecordDate(addday) {
    notaddGroup=true;
    if (addday > 0) {
        currentPage += 1;
        if(currentPage >= pageCount_history){
            $("#groupinfolayer_history").children(".iconfont").eq(2).css("color","#807272");
        }
    } else {
        currentPage -= 1;
        if(currentPage<=1){
            $("#groupinfolayer_history").children(".iconfont").eq(3).css("color","#807272");
        }
    }
    if (!currentPage ) {
        currentPage = 1;
        return false;
    }
    readerHistory(currentPage);
}
//修改群名称或者群头像
function changeGroupInfo(groupInfoObj){
    var groupId = groupInfoObj.groupId;
    if (!groupId) return;
    var $groupId = $("#" + groupId),
        groupName = groupInfoObj.groupName,
        groupImg = groupInfoObj.groupImg;
    if(groupName) {
        $groupId && $groupId.length && $groupId.find("p.nickname").text(groupName);
    }
    if(groupImg){
        var imgUrl = userInfo.configinfo.server_url + "/public/" + groupImg;
        $groupId && $groupId.length && $groupId.find("div.avatarBk").children("img").attr("src", imgUrl);
    }
}

//获得某一天的信息
function writeHistory_oneDay(date,currentPage){
    var self=fileope;
    chatHistorys.paging_personalChat_oneDay(mainWindow.window.userInfo.id,$("#talkusers").children(".setopacity").attr("id"),currentPage || 1,date,function(pageData){
        var userId = mainWindow.window.userInfo.id,
            chinese_name =mainWindow.window.userInfo.chinese_name,
            chat_text = "",
            $parent = $("#historyrecord");
        if(!userId) {
            console.log("读数据时，用户id为undefined");
            return false;
        }
        $parent.empty();
        $.each(pageData.data,function(index,val){
            if(userId===val.sender)
            {
                chinese_name=mainWindow.window.userInfo.chinese_name;
            }
            else
            {
                chinese_name=$("#"+val.sender).find(".nickname").text();
            }
            chat_text = val.message;
            if(chat_text.indexOf("file___")>=0){//文件特殊处理
                chat_text = self.getFileRecord(val.message,val.id,val.date);
            }
            $parent.append($("<div class=\"chatRecord chat_item\"><div class=\"chb\"><img src=\"images/black.png\" onclick=\"remark.selectNode(this)\"></div>" +
            "<div class=\"avatar\"></div><div class=\"chatinfo\"><span class=\"chat_name\">"+chinese_name+"</span>" +
            "<span class=\"chat_date\">"+new Date(val.date).toLocaleString()+"</span>" +
            "<div class=\"chat_text\"><span style='word-break: break-all;'>"+chat_text+"</span></div></div></div>"));
        });
        oneDayFlag = true;
    });
}
function fillBlankChatGroup(){
    var totalHeight= $('.chat-block').height();
    var chatSiteBarObj= $('.chatSiteBar');
    var curHeight= 0;
    chatSiteBarObj.children('li.blank').remove();
    chatSiteBarObj.children('li').each(function(){
        curHeight+= $(this).height();
    });
    if(totalHeight- curHeight> 0)
    {
        var blankGroupCount= parseInt((totalHeight- curHeight)/50)+ 1;
        for(var i=0;i<blankGroupCount;i++)
        {
            chatSiteBarObj.append($('<li class="blank"><div class="chat_member_group chat_item"></li>'));
        }
    }
}

var ContainFile = {
    config : {
        server_url: userInfo.configinfo.server_url,
        content: "file_list",
        downloadBtn: "fileDownload",
        selectFileId: "fileId",
        setTimeoutHandle : null
    },
    getGroupId : function(){
        return $("#talkgroup").children(".setopacity").attr("id");
    },
    _content : function() {
        return $("#" + this.config.content).children("ul.chatSiteBar");
    },
    fileList : function(){
        var _self = this;
        $.ajax(_self.config.server_url+"/api/file/group/"+ _self.getGroupId(), {
            type: 'get',
            success: function (result) {
                console.log(result)
                _self._content().empty();
                for(var i =0,len=result.length;i<len;i++) {
                    var val = result[i];
                    var spanid = new Date().getTime();

                    _self._content().append(_self.uploadFileModule(spanid, val.originalName, _self.getDateForm(val.updatedAt), true, val['F_FI_CreatorId'],val));
                    //_self.viewFileModule(spanid, JSON.stringify(val));
                }
            }
        });
    },
    upload : function(input,type) {
        var files = input.files,
            _self = this;

        for(var i=0;i<files.length;i++) {
            var spanid = new Date().getTime() + i,
                fileArray = [];
            _self._content().prepend(_self.uploadFileModule(spanid, files[i].name, _self.getDateForm(),false,userInfo.id));
            fileArray.push(files[i]);
            _self.sendFile(fileArray, spanid, type);
        }
    },
    uploadFileModule : function(processId,fileName,date,flag,fileCreatorId,val) {
        var $this = $('<li title="'+fileName+'" class="download">' +
            '<div class="chatListGroup chat_item file-box">' +
            '<div class="icon-file"><img src="images/fileico/word.png" alt=""/></div>' +
            '<div class="info"><span class="nickname">' + fileName + '</span></div>' +
            '<div class="extdate" style="cursor:default">' + date + '</div>' +
            '<div class="extdel" style="display: none;"><i class="iconfont">&#xe63d;</i></div>' +
            '</div>' +
            '<p id = '+ processId +' class="down-info">0%</p>' +
            '<div class="wrapper"><div class="load-bar"><div class="load-bar-inner" style="width:0px"></div></div></div>' +
            '</li>');

        if (grCreatorId != userInfo.id && fileCreatorId != userInfo.id) {
            $this.find("div.extdel").remove();
        }

        if(flag){
            $this.find(".down-info").hide();
            $this.find(".wrapper").hide();
            var saveData = {
                fileId: val.id,
                fileName: val.originalName,
                fileMd5: val.name,
                filePath: val.path
            };
            $this.removeClass("download").attr("id", val.id).attr("fileData", JSON.stringify(saveData));
            this.viewFileModuleEvent($this,true);
        }
        return $this;
    },

    updateProcess : function(processId,process){
        $("#"+processId).text(process).next().find("div.load-bar-inner").css('width', process+'%');
    },
    viewFileModule : function(processId,data) {
        var $process = $("#" + processId),
            $this = null,
        _data = JSON.parse(data);

        var saveData = {
            fileId: _data.id,
            fileName: _data.originalName,
            fileMd5: _data.name,
            filePath: _data.path
        };

        $process.hide().next().hide();
        $this = $process.parents("li.download");
        $this.removeClass("download").attr("id", _data.id).attr("fileData", JSON.stringify(saveData));

        this.viewFileModuleEvent($this);
    },
    viewFileModuleEvent : function($module,flag) {
        var _self = this;
        if(flag) {
            $module.unbind("mouseenter").on("mouseenter", function () {
                $(this).find("div.extdel").show();
                $(this).attr("class", "current_chat_item");
            }).unbind("mouseleave").on("mouseleave", function () {
                $(this).find("div.extdel").hide();
                $(this).removeClass("current_chat_item");
            });
        }else {
            $module.parents("ul.chatSiteBar").on("mouseenter", "li", function () {
                    $(this).find("div.extdel").show();
                    $(this).attr("class", "current_chat_item");
                })
                .on("mouseleave", "li", function () {
                    $(this).find("div.extdel").hide();
                    $(this).removeClass("current_chat_item");
                });
        }
        $module.find("div.extdel").unbind("click").on("click", function (e) {  //删除
            e.stopPropagation();
            var $this = $(this);
            $.ajax(_self.config.server_url + "/api/file/" + $this.parents("li").attr("id"), {
                type: 'delete',
                success: function (result){
                    $this.parents("li").remove();
                },
                error: function (err) {
                    console.log(err);
                }
            });
        });

        $module.find("div.icon-file").unbind("click").on("click", function (e) {
            e.stopPropagation();
            var $parents = $(this).parents("li");
            _self.config.selectFileId = $parents.attr("id");

            var fileData = JSON.parse($("#" + $parents.attr("id")).attr("fileData"));
            $parents.find("p").text(0).next().find("div.load-bar-inner").css('width', 0 + '%');

            $.ajax({
                url: _self.config.server_url + "/api/file/"+fileData["fileId"],
                type: 'get'
            }).done(function(data){
                if(data) {
                    $("#" + _self.config.downloadBtn).attr("nwsaveas", fileData.fileName).click();
                }else{
                    _self.DivAlert("该文件已被删除!");
                    $parents.remove();
                }
            });
        });
        $module.find("div.info").unbind("click").on("click", function (e) {
            e.stopPropagation();
            var $parents = $(this).parents("li");
            _self.config.selectFileId = $parents.attr("id");

            var fileData = JSON.parse($("#" + $parents.attr("id")).attr("fileData"));
            $parents.find("p").text(0).next().find("div.load-bar-inner").css('width', 0 + '%');

            $.ajax({
                url: _self.config.server_url + "/api/file/"+fileData["fileId"],
                type: 'get'
            }).done(function(data){
                if(data) {
                    $("#" + _self.config.downloadBtn).attr("nwsaveas", fileData.fileName).click();
                }else{
                    _self.DivAlert("该文件已被删除!");
                    $parents.remove();
                }
            });
        })
    },
    sendFile : function(files,spanid,type) {
        if (!files || files.length < 1) {
            return;
        }
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            formData.append('file', file);
        }
        console.log(this.getGroupId())
        formData.append('submit', '中文');
        formData.append('groupid', this.getGroupId());
        formData.append('creatorId', userInfo.id);

        var xhr = new XMLHttpRequest(),
            _self = this;

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var fileData = xhr.responseText;
                    _self.viewFileModule(spanid, fileData);
                    $("#fileUpload_contain").val('');
                }
                else {
                    _self.remFileModule(spanid);
                }
            }
        };
        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                var percentage = parseInt((event.loaded / event.total) * 100);
                _self.updateProcess(spanid, percentage + "%");
            }
        };
        xhr.open('post', _self.config.server_url + '/api/file/upload', true);
        xhr.send(formData);
    },
    downloadFile : function(input,originalName) {
        var url = require('url'),
            http = require('http'),
            fs = require('fs'),
            _self = this;

        var fileData = JSON.parse($("#" + _self.config.selectFileId).attr("fileData"));
        var path = input.value;
        var originalNameArr = input.getAttribute("nwsaveas").split('.');
        if(originalNameArr.length > 1) {
            var originalExtensionName = originalNameArr[originalNameArr.length - 1];
            var NewNameArr = path.split('.');
            var NewExtensionName = NewNameArr[NewNameArr.length - 1];
            if (NewExtensionName != originalExtensionName) {
                path = path + '.' + originalExtensionName;
            }
        }
        var fileid = fileData.fileMd5,
            file_url = _self.config.server_url + "/" + fileid,
            file = fs.createWriteStream(path);
        var request = http.get(file_url, function (res) {
            var fsize = res.headers['content-length'],
                $selectFile = $("#" + _self.config.selectFileId);

            $selectFile.addClass("download");
            $thisLoadBar = $selectFile.find("div.load-bar-inner");
            $thisP = $selectFile.find("p");

            $thisLoadBar.parents("div.wrapper").show();
            $thisP.show();

            res.on('data', function (data) {
                file.write(data);
                var percentage = parseInt(100 - (((fsize - file.bytesWritten) / fsize) * 100));
                $thisLoadBar.css('width', percentage + '%');
                $thisP.text(percentage +"%");
            }).on('end', function () {
                $thisLoadBar.css('width', 100 + '%');
                $thisP.text(100 + "%");
                setTimeout(function () {
                    $thisLoadBar.parents("div.wrapper").hide();
                    $thisP.hide().text(0 + "%");
                    $selectFile.removeClass("download");
                    $("#" + _self.config.downloadBtn).val('');
                }, 1200);
                file.end();
            });
        });
        request.on('error', function (e) {
            console.log("下载失败");
        });
    },
    getDateForm : function(date) {
        var dateTime = date && new Date(date) || new Date(),
            dateTime_year = dateTime.getFullYear(),
            dateTime_Month = (dateTime.getMonth() + 1),
            dateTime_Day = dateTime.getDate();
        dateTime_Month = dateTime_Month < 10 ? ("0" + dateTime_Month) : dateTime_Month;
        dateTime_Day = dateTime_Day < 10 ? ("0" + dateTime_Day) : dateTime_Day;
        return dateTime_year.toString() + "/" + dateTime_Month + "/" + dateTime_Day;  //不是当天和不是本月的
    },
    DivAlert: function (msg, time) {
        var $alertDiv = $(".alertDiv"), html = null,_self = this;

        if ($alertDiv && $alertDiv.length) {
            clearTimeout(_self.config.setTimeoutHandle);
            html = $alertDiv;
            setTimeoutFn();
        } else {
            html = html = $('<div class="alertDiv"><span>' + msg + '</span></div>');
            html.on('click', function () {
                $(this).remove();
                return false;
            });
            $('.viewContain').after(html);
            setTimeoutFn();
        }
        function setTimeoutFn(){
            _self.config.setTimeoutHandle = setTimeout(function () {
                html.remove();
            }, time || 2000);
        }
    }
};
