/**
 * Created by 安lien on 2015/12/21.
 */

/*聊天信息的分类
 *离线信息
 *未打开窗口时接收的数据
 *未获得焦点前收到的信息，有此人但不是和他聊
 *收到的信息
 * */
(function(exports,$){
    var isfocus=true,
        notaddUsers=false,
        gui = require('nw.gui'),
        chatUsers = [],
        userInfom = JSON.parse(localStorage.getItem('userInfo')),
        _projectId = -3,
        // record_date=fileope.getDate(),
        isflush_his=false,
        select_oneDay = '',
        oneDayFlag = false,
        myNotification = null;
    exports.personal_historyPage = 0;

    function UsersCont(useInfo) { //用户联系人
        this.useInfo = useInfo;
        this.hdWarp = "div.hd_warp";
        this.hdWarpList = "div.hd_warp_list";
        this.setopacity = "div.setopacity";
        this.talkusers = "#talkusers";
    }

    //确定位置
    viewUser = 7;
    v_width = 76*viewUser;
    UsersCont.prototype.enSureLocation = function($thisUser) {
            var content_list = $(this.hdWarpList),
        //获取界面当前显示的图片个数
               i = viewUser;
        var len = $("div.hd_warp").find(".hd_member").length;
        userlist_page = Math.abs(Math.ceil(parseInt(content_list.css("left").slice(0,-2))/v_width))+ 1;

        page_count = Math.ceil(len / i);   //只要不是整数，就往大的方向取最小的整数
        var gapPageCurrPage = setopa_currPage = Math.ceil((content_list.find(this.setopacity).index() + 1) / i);

        if(userlist_page >=1 && userlist_page != setopa_currPage && userlist_page<=page_count) {
            gapPageCurrPage = userlist_page;
        }
        //当前获得焦点的用户和目标用户的间隔页码数______不是当前页码
        var userGapPage = Math.ceil(($thisUser.index() + 1) / i) - gapPageCurrPage,
        thisUser_left = $thisUser.offset().left;

        //双击的用户是否在当前页面中
        if (thisUser_left < 0 || thisUser_left > 500) {
            var symbol = userGapPage > 0 ? '-=' : '+=';
            if (userGapPage == 0 && thisUser_left > 500) {
                userGapPage = Math.ceil(($thisUser.index() + 1) / i) - (Math.abs(Math.ceil(parseInt(content_list.css("left").slice(0, -2)) / v_width)) + 1);
                symbol = '-=';
            }
            if (userGapPage == 0 && thisUser_left < 0) {
                userGapPage = (Math.abs(Math.ceil(parseInt(content_list.css("left").slice(0, -2)) / v_width)) + 1) - Math.ceil(($thisUser.index() + 1) / i);
                symbol = '+=';
            }
            content_list.animate({left: symbol + Math.abs(v_width * userGapPage)}, "slow");
        }
        $thisUser.triggerHandler("click");
    };

    UsersCont.prototype.getClassName = function(bl_online){
        return bl_online ? "hd_member setopacity" : "hd_member setopacity desaturate ";
    };

    UsersCont.prototype.getUserModel = function() {
        return '<div id="userId" class="className">' +
            '<div class=\"avatarBk\"><img src="images/defaultAvatar.png" class=\"avatar\"></div>' +
            '<p class=\"nickname\">chinese_name</p>' +
            '<div class=\"close_avatar\"><i class="iconfont">&#xe63d;</i></div>';
    };

    UsersCont.prototype.setModelInfo = function(userinfo,bl_online,barseUrl) {
        var $model = $(this.getUserModel());
        $model.attr("id", userinfo.id).addClass(this.getClassName(bl_online)).find("div.avatarBk")
            .children("img").attr("src", barseUrl + "/" + userinfo.image);
        $model.find(".nickname").text(userinfo.chinese_name || userinfo['name']);
        return $model;
    };

    UsersCont.prototype.bindModelEvetn = function($user){
        var _self =this,
            $new_user = $user;
        $new_user.find(".close_avatar").click(function () {
            var userId = $new_user.attr("id");
            saveCloseTime(JSON.stringify([userId]),userInfom.configinfo.server_url,userInfom.id);
            arrSplice(chatUsers,userId);

            if ($new_user.hasClass("setopacity")) {
                if ($new_user.next().length) {//获得焦点的
                    //下一个子对象获得焦点
                    $new_user.next().triggerHandler("click");
                } else {
                    if($new_user.offset().left<76 && !$new_user.next().length){
                        //本业删完，返回上一页
                        $new_user.siblings().eq(0) && $new_user.siblings().eq(0).triggerHandler("click");
                        $("span.prev").triggerHandler("click");
                    }else{
                        //上一个子对象获得焦点
                        $new_user.prev().length && $new_user.prev().triggerHandler("click");
                    }
                }
            }else{//未获得焦点的
                if($new_user.offset().left<76 && !$new_user.next().length){
                    $("span.prev").triggerHandler("click");
                }
            }
            $new_user.remove();
            checkUserNumber($("#talkusers"));   //检查用户列表中的人数是否大于1
            helpHand.writeHistory(1);
        });
        $new_user.click(function (index) {//点击后  保存数据，替换焦点，显示切换前的数据
            oneDayFlag = false;
            Message.saveMess();

            var user_id=$(this).attr("id");
            $("#"+user_id).children("div.avatarBk").removeClass("newmsg");
            $(this).siblings().removeClass("setopacity").end().addClass("setopacity");

            showOldMess(user_id);
            Message.getOfflineMess(user_id);//获得离线消息
            Message.getBeforFocusMess(user_id);

            $("div.box_bd").scrollTop(getMessHeight());
            $("#history_list").children("ul.chatSiteBar").empty();

            helpHand.writeHistory(1);
            if(myNotification){
                myNotification.close();
            }

            $("#chackTextarea-area").css("height",'40').empty();
        });
        $new_user.hover(function(){
            $(this).find(".close_avatar").show();
        },function(){
            $(this).find(".close_avatar").hide();
        });
    };
    UsersCont.prototype.turnUser = function(){
        Message.saveMess();
    };

    UsersCont.prototype.addUser = function(userinfo,bl_online,baseUrl){
        $(this.hdWarpList ).animate({left: 0 }, "slow");
        var $model = this.setModelInfo(userinfo,bl_online,baseUrl);
        this.turnUser();
        this.bindModelEvetn($model);
        $("#chackTextarea-area").empty();
        $(this.talkusers).children().removeClass("setopacity").end().prepend($model);
    };

    var queueTime = [];
    var Message = { //消息的处理
        getOfflineMess: function (userId) {
            var messArr = JSON.parse(localStorage.getItem("noRead_mess"+_projectId+userInfom.id)),
                _self = this;
            if (messArr) {
                var messVal = messArr[userId];
                if (!messVal)return;
                if (messVal instanceof Array) {
                    $.each(messVal, function (attrName, val) {
                        _self.receiveMessage(val.message, val.sender, val.time || false, true);
                    });
                }
                delete messArr[userId];
                localStorage.setItem("noRead_mess"+_projectId+userInfom.id, JSON.stringify(messArr));//保存取出后的
            }
        },
        getBefOpenWinMess: function (uid) {     //取出未打开窗口时接收的数据
            var key = "Win_off_mess_" +_projectId + uid;
            this.readMess(key,uid,true);
        },
        getBeforFocusMess: function (uid) {     //未获得焦点前收到的信息
            var key = "win_focus_befor_mess_" + _projectId + uid;
            this.readMess(key, uid);
        },
        readMess: function (key, uid, bl) { //窗口获得焦点前的信息

            var mess = JSON.parse(localStorage.getItem(key)),
                _self = this;
            if (mess instanceof Array) {
                $.each(mess, function (index, val) {
                    _self.receiveMessage(val.mess, val.sender, val.date, bl || false);
                })
            }
            localStorage.removeItem(key);
        },
        saveMess:function () {
            var $div_box_bd = $("div.box_bd");
            localStorage.setItem($(".setopacity").attr("id"), $div_box_bd.html());
            $div_box_bd.empty();
        },
        changeLocaStor : function(sender,message) {
            var messObj = {"sender": sender, "mess": message, "date": new Date().getTime()},
                mes_key = "win_focus_befor_mess_" + _projectId + sender,
                userMes = localStorage.getItem(mes_key);
            if (userMes) {
                oldArr = JSON.parse(localStorage.getItem(mes_key));
                oldArr instanceof Array ? oldArr.push(messObj) : oldArr = [];
                localStorage.setItem(mes_key, JSON.stringify(oldArr));
            } else {        //此处只是简单的存储，没有时间标识
                localStorage.setItem(mes_key, JSON.stringify([messObj]));
            }
        },
        receiveMessage: function (message, sender, date, isnosave) {
            var dateTime = !!date ? new Date(date).getTime() : new Date().getTime();
            var flag = true;
            $.each(queueTime, function (index, val) {
                if (val == dateTime) {
                    flag = false;
                }
            });

            if (!flag) return;
            var $sender = $("#" + sender);
            if ($sender.hasClass("setopacity")) {
                var chat_time = !!date ? new Date(date).toLocaleString() : new Date().toLocaleString();
                var messageId = chatHistorys.addPersonalChat(sender, userInfom.id, message, date),
                    userId2 = $("#talkusers").children(".setopacity").attr("id"),
                    userdiv = document.getElementById(userId2),
                    htmlstr = "";
                message = fileope.createFilediv(message, JSON.stringify({id: messageId, filename: ""}));

                if (message.indexOf("alt=\"Pluto.jpg\"/") < 0) {
                    htmlstr = "<div class=\"chat_content_group you\"><p class=\"time\">" + chat_time + "</p>" +
                        "<div class=\"avatarBk\">" +
                        "<img src=\"" + userdiv.childNodes[0].childNodes[0].src + "\" class=\"avatar\">" +
                        "<span>" + userdiv.childNodes[1].innerHTML + "</span></div> " +
                        "<h3 class=\"chat_content\">" + message + "</h3></div>";
                }
                else {
                    htmlstr = "<div class=\"chat_content_group you\"><p class=\"time\">" + chat_time + "</p><div class=\"avatarBk\">" +
                        "<img src=\"" + userdiv.childNodes[0].childNodes[0].src + "\" class=\"avatar\">" +
                        "<span>" + userdiv.childNodes[1].innerHTML + "</span></div> " +
                        "<h3 class=\"chat_img\">" + message + "</h3></div>";
                }

                var $receiveMes = $(htmlstr);
                sendAndReceiveMessForm($receiveMes);

                queueTime.push(dateTime);
                chatHistorys.checkPersonalChat(dateTime, function (count) {
                    if (!count) {
                        $.each(queueTime, function (index, val) {
                            if (val == dateTime) {
                                queueTime.splice(index, 1);
                            }
                        });

                        if (queueTime.length == 3000) {
                            queueTime = [];
                        }
                    } else {
                        $("div.box_bd").remove($receiveMes);
                    }
                });
            } else {
                //则保存下来   找个文件进行保存
                $sender.children("div.avatarBk").addClass("newmsg");//对数据进行保存
                this.changeLocaStor(sender, message);
                var $send = $("#" + sender),
                    nickname = $send.find(".nickname").text();
                if (myNotification) {
                    myNotification.close();
                }
                helpHand.notifyInfo(nickname, message);
            }
        }
    };
    var helpHand = {
        //重新连接
        reConnect: function () {
            $("#talkusers").children(".setopacity").triggerHandler("click");
            //标注消息为未读
            var offLineMess = JSON.parse(localStorage.getItem("noRead_mess"+_projectId+userInfom.id));
            if (offLineMess) {
                $.each(offLineMess, function (userid, mess) {
                    if (checkUserExist(userid)) {
                        if (mess) {
                            $("#" + userid).addClass("").children("div.avatarBk").addClass("newmsg");
                        }
                    }
                })
            }
        },
        writeHistory_oneDay: function () {
            console.log('writeHistory_oneDay');
            var self = fileope;
            chatHistorys.paging_personalChat_oneDay(mainWindow.window.userInfo.id, $("#talkusers").children(".setopacity").attr("id"), currentPage || 1, date, function (pageData) {
                var userId = mainWindow.window.userInfo.id,
                    chinese_name = mainWindow.window.userInfo.chinese_name,
                    chat_text = "",
                    $parent = $("#history_list").children("ul.chatSiteBar");
                if (!userId) {
                    console.log("读数据时，用户id为undefined");
                    return false;
                }

                $parent.empty();

                $.each(pageData.data, function (index, val) {
                    if (userId === val.sender) {
                        chinese_name = mainWindow.window.userInfo.chinese_name;
                    }
                    else {
                        chinese_name = $("#" + val.sender).find(".nickname").text();
                    }
                    chat_text = val.message;
                    if (chat_text.indexOf("file___") >= 0) {//文件特殊处理
                        console.debug(val);
                        chat_text = self.getFileRecord(val.message, val.id, val.date);
                    }
                    $parent.append($("<div class=\"chatRecord chat_item\">" +
                        /*"<div class=\"chb\"><img src=\"images/black.png\" onclick=\"remark.selectNode(this)\"></div>" */+
                    "<div class=\"avatar\"></div><div class=\"chatinfo\"><span class=\"chat_name\">" + chinese_name + "</span>" +
                    "<span class=\"chat_date\">" + new Date(val.date).toLocaleString() + "</span>" +
                    "<div class=\"chat_text\"><span style='word-break: break-all;'>" + chat_text + "</span></div></div></div>"));
                });
                oneDayFlag = true;
            });
        },
        //写消息记录的方法
        writeHistory: function writeHistory(currentPage) {//修改翻页
            if(currentPage >= personal_historyPage || personal_historyPage==0){
                $("#groupinfolayer_history").children(".iconfont").eq(2).css("color", "#807272");
            }
            if(currentPage <= 1) {
                $("#groupinfolayer_history").children(".iconfont").eq(3).css("color", "#807272");
            }
            currPage = currentPage || 1;
            fileope.writeUserHistory(currentPage || 1);
        },
        changeRecordDate: function (addday) {
            currPage += addday;
            if (!currPage) {
                currPage = 1;
            }
            if (!oneDayFlag) {
                helpHand.writeHistory(currPage);
            }
            return false;
        },
        openHistory: function () {
            document.getElementById("cutbtn").onclick = function () {
                helpHand.writeHistory(1);
            };
        },
        //当窗口没有焦点是弹出提示信息
        notifyInfo :function(sendName,mess,userImg) {
            var win = gui.Window.get();
            if(mess.indexOf('class="face"')){
                mess = "新消息";
            }
            if (!isfocus) {
                myNotification = new Notification(sendName, {
                    body:  mess,
                    icon: "images/logo.png"
                });
                myNotification.onclick = function () {
                    win.focus();
                }
            }
        }
    };

    //面板的入口
    //添加聊天人员
    exports.addTalkUsers = function (user_info,bl_online,baseUrl) {
        var userinfo = JSON.parse(user_info),
            userId = userinfo.id;
        if (!userId) {
            throw  "userId is undefined !";
        }
        usersCont = new UsersCont(user_info);
        chatUsers.push(userId);

        $("#history_list").children("ul.chatSiteBar").empty();
        if (checkUserExist(userId)) {   //窗口已经打开聊天页面的情况
            usersCont.enSureLocation($("#" + userId));
        } else {
            usersCont.addUser(userinfo, bl_online, baseUrl); //窗口没有打开聊天的页面
            Message.getOfflineMess(userId);//获得离线消息
            Message.getBefOpenWinMess(userId);  //打开窗口前收到的消息
            helpHand.writeHistory(1);
            var $groupinfolayer_history = $("#groupinfolayer_history").children(".iconfont");
            $groupinfolayer_history.eq(2).css("color", "#807272");
            $groupinfolayer_history.eq(3).css("color", "#807272");
        }
    };
    exports.helpHand = {
        changeRecordDate: function (addday) {
            currPage += addday;
            if (!currPage) {
                currPage = 1;
            }
            if (!oneDayFlag) {
                helpHand.writeHistory(currPage);
            } else {
                helpHand.writeHistory_oneDay(select_oneDay, currPage);
            }
            return false;
        },
        getUserInfo: function (userId) {
            return mainWindow.window.personalChat.getChatUserInfo(userId);
        },
        getUserImageUrl: function (userId) {
            return mainWindow.window.personalChat.getUserImageUrl(userId);
        }
    };
    exports.mainWindowFn = {
        cleanMainWind: function() {     //关闭窗口要进行的操作
            saveCloseTime(JSON.stringify(chatUsers), userInfom.configinfo.server_url, userInfom.id); //保存最后聊天的时间
            if (mainWindow)
                mainWindow.window.personalChat.setChildWindow(_projectId);
            cleanLocalStorage(chatUsers);
        },
        upOrDown_line: function(id,upOrDown) { //用户id  上线为true，下线为false
            var $user = $("#" + id);
            if ($user.length) {
                upOrDown ? $user.removeClass("desaturate") : $user.addClass("desaturate");
            }
        },
        setMainWindow : function (main,projectId,projectName){
            mainWindow = main;
            _projectId = projectId;
            $("div.hd-head").children("h4").text(projectName);
            chatHistorys.init();
        },
        receiveMessage : function(message, sender, date, isnosave){
            Message.receiveMessage(message, sender, date, isnosave);
        },
        receiveMessage_me : function(msg,recipient,date) {
            sendMess(userInfom.id, msg,date);
            if(msg.indexOf("file___")<0){
                chatHistorys.addPersonalChat(userInfom.id, recipient, msg, date);
            }
        },
        getIsfocus : function(){
          return isfocus;
        },
        closeUserWin : function(userId) {
            var $user = $("#" + userId);
            if ($user && $user.length) {
                $user.find(".close_avatar").triggerHandler("click");
            }
        }
    };
    $(function() {
        $("#closs_div").click(closeWindow);
        $("#mix_div").click(minimizeWindow);

        $("#add_face_btn").children("a").click(function () {
            var className = $(this).attr("class");
            switch (className) {
                case "btn_text":
                {
                    var $chat_tex = $("#chackTextarea-area"),
                        mesg = $chat_tex.html(),
                        userId = "";

                    mesg = replaceText(mesg);
                    $chat_tex.empty();
                    if (!mesg.replace(/[\s\uFEFF\xA0]/g,"") ||!mesg.replace(/&nbsp;/ig,"")) {
                        notaddUsers = true;
                        return false;
                    }

                    mesg = changeImage(mesg);
                    //后面追加信息
                    userId = $("#talkusers").children(".setopacity").attr("id");
                    mainWindow.window.personalChat.sentMessage(userId, mesg,_projectId);
                    $chat_tex.css({"height": '40', 'overflowY': 'hidden'});
                    $("#facebox").hide();
                    break;
                }
            }
            return false;
        });

        $("div.box_bd").empty();
        var win = gui.Window.get();
        win.on('focus', function () {
            isfocus = true;
        });
        win.on('blur', function () {
            isfocus = false;
        });

        helpHand.openHistory();
        fileope.fileUpload();
        // remark.init();

        //显示隐藏右侧面板
        $("#cutbtn").click(function () {
            var $right_rightCont = $(".right_Contain"),
                $hd_member = $(".hd_member"),
                win = gui.Window.get(),
                _this = this;
            $hd_member.css("margin", "0 13px");
            if ($right_rightCont.is(":hidden")) {
                win.resizeTo(892, 600);
                setTimeout(function () {
                    $(_this).attr("src", "images/recordstretch.png");
                    $right_rightCont.show();
                    $(".left_Contain").addClass("left_Contain_1").removeClass("left_Contain");
                }, 25);
            }
            else {
                $(_this).attr("src", "images/recordshrink.png");
                $right_rightCont.hide();
                $(".left_Contain_1").addClass("left_Contain").removeClass("left_Contain_1");
                win.resizeTo(592, 600);
            }
        });

        //关闭头像
        $(".hd_member").mouseover(function () {
            $(this).find(".close_avatar").show();
        }).mouseleave(function () {
            $(this).find(".close_avatar").hide();
        });

        //关闭界面按钮
        $(document).mouseover(function () {
            $(".close_emtry").children("img").attr("src", "images/closing.png");
        }).mouseleave(function () {
            $(".close_emtry").children("img").attr("src", "images/close_begin.png");
        });

        var $chackTex = $("#chackTextarea-area"),
            chackTexLeg = $chackTex.children().length || 1;

        $(".viewContain").on('click', function (e) {
            $("#addfeature").css("opacity");
            $(".extrapupicon").hide();
            $("#addemotion").css("opacity");
            var newLeg = $chackTex.children().length;
            if(chackTexLeg != newLeg && e.target["id"] != "chackTextarea-area" &&　!e.target.classList.contains('face')){
                //点击界面，滚动聊天
            //   $("#chackTextarea-area").scrollTop(Number.MAX_VALUE);
            }
            if(!$(e.target).parents("div.qqFace").length) {
                $("#facebox").hide();
            }

        });

        $("#addemotion").qqFace({
            id: 'facebox', //表情盒子的ID
            assign: 'chackTextarea-area', //给那个控件赋值
            path: 'images/face/'	//表情存放的路径
        });

        //鼠标点上去，出现附加功能和表情
        $("#addfeature").on('click', function (e) {
            $(".extrapupicon").toggle();
            $(this).css("opacity") == 1 ? $(this).css("opacity") : $(this).css("opacity", 1);
            $("#addemotion").parent().find('.chat_btn').css('opacity').end().children("div").hide();
            e.stopPropagation();
        });

        /*$("#chatRemark").datepicker({dateFormat: 'yy-mm-dd'}).on("change", function () {
            currPage = 1;
            select_oneDay = $(this).val();
            helpHand.writeHistory_oneDay(select_oneDay, 1);
            $(this).val('');
        });*/

        $("#groupinfolayer_history").children(".iconfont").eq(2).hover(function(){
            if(currPage >= personal_historyPage || personal_historyPage <= 1){
                $(this).css("color","#807272");
            }else{
                $(this).removeAttr("style");
            }
        },function(){
            if(personal_historyPage != 0 && personal_historyPage >1 && personal_historyPage > currPage){
                $(this).removeAttr("style");
            }
        }).end().eq(3).hover(function() {
            if (currPage <= 1) {
                $(this).css("color", "#807272");
            } else {
                $(this).removeAttr("style");
            }
        },function() {
            if (currPage > 1) {
                $(this).removeAttr("style");
            }
        })
    });
})(window,jQuery);
