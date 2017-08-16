/**
 * Created by 安李恩 on 2015/7/29.
 */

//关闭窗口
function closeWindow(){
    var gui = require('nw.gui');
    var win = gui.Window.get();
	mainWindowFn.cleanMainWind();
    win.close();
}
//最小化窗口
function minimizeWindow()
{
	var gui = require('nw.gui');
    var win = gui.Window.get();
    win.minimize();
}
//保存关闭时间
function saveCloseTime(arr,url,userId){
    if(arr.length){
        $.ajax({
            type : 'put',
            url : url+"/api/messageStatus/",
            data:"sender="+arr+"&receiverId="+userId,
            error:function(data){
                console.debug("修改失败");
            }
        });
    }
}
//获得消息的高度
function getMessHeight() {//聊天的用户id
    var height = 0;
    $("div.box_bd").children().each(function (index, val) {
        height += $(val).outerHeight(true);
    });
    return height;
}

//发和收消息的处理
function sendAndReceiveMessForm($message_html){
    var $chat_content =$("div.box_bd");
    $chat_content.append($message_html);
   $chat_content.scrollTop(getMessHeight());
}
//检查和当前用户聊天的人数，少于一人时关闭聊天窗口
function checkUserNumber($obj) {
    var userNumber = $obj.children().length;
    if (userNumber < 1)closeWindow();
}

//取出数据并显示
function showOldMess(uid) {
	var old_mess = localStorage.getItem(uid);
	if (old_mess) {
		var $mess = $(old_mess);
		$mess.filter(".chat_content_group.me").find("div.avatarBk").find("img").attr("src", userImg);
		$("div.box_bd").html($mess);
	}
}
//发的信息
function sendMess(id,message,date) {

    var chat_time = chat_time = date ? new Date(date).toLocaleString() : new Date().toLocaleString(),
		userInfo =JSON.parse(localStorage.getItem("userInfo"));
	if(message.indexOf("file___")<0) {
		var $message_html = $("<div class='chat_content_group me'>" +
			"<p class=\"time\">" + chat_time + "</p><div class='avatarBk'>" +
				"<img src=\""+userInfo.configinfo.server_url+"/"+userInfo.image+"\" class=\"avatar\">" +
				"<span>"+userInfo.chinese_name+"</span></div>" +
				"<h3 class=\"chat_content\">" + message  +
				"</h3></div>");
		sendAndReceiveMessForm($message_html);
	}
}
//验证当前页面该用户已经存在
function checkUserExist(uid){
    var $thisUser =$("#"+uid);
    return $thisUser.length>0;
}
//清除本地的LocalStorage
function cleanLocalStorage(arr){
    $.each(arr,function(index,val){
        if(val){
            if(localStorage.getItem(val)){
                localStorage.removeItem(val)
            }
        }
    });
}
//删除某个元素
function arrSplice(arr,val){
    var index = arr.indexOf(val);
    arr.splice(index,1);
}
var userlist_page = 1;
$(function() {
	var page_count = 0;
	//向后 按钮
	$("span.next").click(function () {
		var content = $("div.hd_warp");
		var content_list = $("div.hd_warp_list");
		var i = Math.floor(v_width / 76);//获取界面当前显示的图片个数    //an:76这个参数若修改，请通知下做聊天切换用户上的人
		var len = content.find(".hd_member").length;
		page_count = Math.ceil(len / i);   //只要不是整数，就往大的方向取最小的整数

		userlist_page = Math.abs(Math.ceil(parseInt(content_list.css("left").slice(0,-2))/v_width))+1;
		if (!content_list.is(":animated")) {       //判断“内容展示区域”是否正在处于动画
			userlist_page++;
			if (userlist_page <= page_count) {
				content_list.animate({left: '-=' + (v_width)}, "slow");  //通过改变left值，达到每次换一个版面
			} else {
				userlist_page--;
			}
		}
		if(userlist_page >= page_count){
			$(this).children("i").css("color","#807272");
		}
	}).children("i").hover(function(){
		var content = $("div.hd_warp");
		var content_list = $("div.hd_warp_list");
		var i = Math.floor(v_width / 76);//获取界面当前显示的图片个数    //an:76这个参数若修改，请通知下做聊天切换用户上的人
		var len = content.find(".hd_member").length;
		page_count = Math.ceil(len / i);   //只要不是整数，就往大的方向取最小的整数
		userlist_page = Math.abs(Math.ceil(parseInt(content_list.css("left").slice(0,-2))/v_width))+1;
		if(userlist_page >= page_count){
			$(this).css("color","#807272");
		}
	},function(){
		if(userlist_page >= page_count){
			$(this).removeAttr("style");
		}
	});
	//往前 按钮
	$("span.prev").click(function () {
		var content = $("div.hd_warp");
		var content_list = $("div.hd_warp_list");
		var i = Math.floor(v_width / 76);//获取界面当前显示的图片个数
		var len = content.find(".hd_member").length;
		page_count = Math.ceil(len / i);   //只要不是整数，就往大的方向取最小的整数
		userlist_page = Math.abs(Math.ceil(parseInt(content_list.css("left").slice(0,-2))/v_width))+1;
		if (!content_list.is(":animated")) {    //判断“内容展示区域”是否正在处于动画
			userlist_page--;
			if (userlist_page >= 1) {
				content_list.animate({left: '+=' + v_width}, "slow");
			}else{
				userlist_page ++;
			}
		}
		if(userlist_page <= 1){
			$(this).children("i").css("color","#807272");
		}

	}).children("i").hover(function(){
		var content_list = $("div.hd_warp_list");
		userlist_page = Math.abs(Math.ceil(parseInt(content_list.css("left").slice(0,-2))/v_width))+1;
		if(userlist_page == 1){
			$(this).css("color","#807272");
		}
	},function(){
		if(userlist_page == 1) {
			$(this).removeAttr("style");
		}
	});

	var isdown = false,
			sentType = 0,
			$sendMethod = $(".sendmethod"); //Enter

	$(document).on("keyup", function (e) {
		e = e || window.event;
		var keycode = e.which ? e.which : e.keyCode,
				$chatTextarea = null;
		if (keycode === 17) {
			isdown = false;
		}
	}).on("keydown", function (e) {
		e = e || window.event;
		var keycode = e.which ? e.which : e.keyCode;
		if (keycode === 17) {
			isdown = true;
		}
		if(e.target.id == "chackTextarea-area") {
			var $textarea = $("#chackTextarea-area");
			if (sentType == 0) {
				if (e.keyCode == 13 && !e.ctrlKey) {
					$("#add_face_btn").children().eq(0).triggerHandler("click");
					$textarea.children().remove();
					setTimeout(function(){
						$("#chackTextarea-area").css("height",'40px').children().remove();
					},100)
				}
				if (e.ctrlKey && e.keyCode == 13) {
					focusEnd($textarea, "<br><br>");
				}
			}

			if (sentType == 1) {
				if (e.ctrlKey && e.keyCode == 13) {
					$("#add_face_btn").children().eq(0).triggerHandler("click");
				}
			}
		     	$textarea.scrollTop(Number.MAX_VALUE);
		}
	}).on("click",function(){
		$sendMethod.children("ul").hide();
	}).one("click",function(){
		if(window["chatHistorys"]) {
			chatHistorys.getUserConfig("shortcutKey", function (data) {
				$sendMethod.find("li").eq(data).addClass("sendtype").siblings().removeClass("sendtype");
				sentType = data;
			});
		}
	});

	//点击按钮，选择发送方式
	$sendMethod.on("click"," i",function(e){
		e.stopPropagation();
		$(this).addClass("rotateDown");
		var $twomethod = $(this).siblings(".twomethod");
		if($twomethod.is(":hidden")) {
			$twomethod.show();
		}else{
			$twomethod.hide();
		}
	}).on("click","li",function(e){
		sentType = $(this).index();
		$(this).addClass("sendtype").siblings().removeClass("sendtype").parents("ul").hide();
		chatHistorys.addUserConfig("shortcutKey",sentType);
	});

	$("#talk_content,#historyrecord").unbind("click").on("click","a",function(e){
		e.stopPropagation();
		try {
			var gui = require('nw.gui'),
					shell = gui.Shell;
			shell.openExternal($(this).attr("href"));
		}catch(e) {
			console.log("打开链接时出现错误!");
		}
		return false;
	})

});

function focusEnd($obj,text) {
	var obj = $obj[0];
	var range, node;
	if (!obj.hasfocus) {
		obj.focus();
	}
	if (window.getSelection && window.getSelection().getRangeAt) {
		range = window.getSelection().getRangeAt(0);
		range.collapse(false);
		node = range.createContextualFragment(text);
		var c = node.lastChild;
		range.insertNode(node);

		if (c) {
			range.setEndAfter(c);
			range.setStartAfter(c)
		}

		var j = window.getSelection();
		j.removeAllRanges();
		j.addRange(range);

	} else if (document.selection && document.selection.createRange) {
		document.selection.createRange().pasteHTML(text);
	}
}

//表情图标转换
function changeImage(str) {
	for (var i = 1; i <= 75; i++) {
		var flagstr = "[em_" + i + "]";
		while (str.indexOf(flagstr) >= 0) {
			str = str.replace(flagstr, "<img src=\"images/face/" + i + ".gif\">");//"images/faces/"+i+".gif");
		}
	}
	return str
}

function replaceText(text) {
	// console.debug(text);
	if (text) {
		var textRegExp = $("<div>" + text + "</div>").text();

		var reResult = textRegExp.match(/((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])*/g),
				replaceVal = text,
				regExp = null;
		//console.debug(reResult);
		linkArr = reResult;//uniqArr(reResult);
		//console.debug(linkArr);
		var lingarr2=[];
		//console.debug(replaceVal);
		if (linkArr && linkArr.length) {
			$.each(linkArr, function (index, val) {
				try {
					regExp = new RegExp(val, "g");
					//console.debug(replaceVal);
					var value=replaceVal.substring(0,replaceVal.indexOf(val)+val.length);
					replaceVal=replaceVal.substring(replaceVal.indexOf(val)+val.length,replaceVal.length);
					if (val.indexOf("http") >= 0) {
						value = value.replace(regExp, "<a href='" + val+ "'>" + val + "</a>");
					}
					if (val.indexOf("http") < 0) {
						var href = "http://" + val;
						value = value.replace(regExp, "<a href='" + href + "'>" + val + "</a>");
					}
					lingarr2.push(value);
					//console.debug("////////////////////////");
				} catch (e) {
					console.log("链接错误")
				}
			});
			//console.debug(replaceVal)
			//console.debug(lingarr2);
			var result="";
			for(var i=0;i<lingarr2.length;i++){
				//console.debug(lingarr2);
				result=result+lingarr2[i];
			}
			result=result+replaceVal
			return result;
		}
	}
	return text;
}
function  uniqArr(arr) {
	if ($.isArray(arr)) {
		var mergeArr = [];
		$.each(arr, function (index, val) {
			var flag = true;
			$.each(mergeArr, function (tIndex, tVal) {
				if (val == tVal) {
					flag = false;
					return false;
				}
			});
			if (flag) {
				mergeArr.push(val);
			}
		});
		return mergeArr;
	}
	return [];
}

//历史记录里没有区分自己和他人  没法子分开改头像——加个类
//切换头像聊天对象时更改聊天对象，没有更改自己的头像——创建一个全局字段，切换时判断下，然后更改
var userImg = (function() {
	var _userInfo,_userInfo_gol = null;
	if(window.hasOwnProperty("userInfo")) {
		_userInfo_gol = userInfo;
	}
	_userInfo = _userInfo_gol || JSON.parse(localStorage.getItem('userInfo'));
	return _userInfo.configinfo.server_url + "/" + _userInfo.image;
})();

function changeUserImage(strUrl) {//更改头像时，更新聊天界面中的头像
	var _userInfo = window.hasOwnProperty("userInfo") ? userInfo : JSON.parse(localStorage.getItem('userInfo'));
	var $me = $(".chat_content_group.me"),
			$historyrecord = $("#historyrecord").children();

	userImg = _userInfo.configinfo.server_url + "/" + strUrl;
	$me && $me.length && $me.find("div.avatarBk").find("img").attr("src", userImg);

	//历史记录中切换头像
	$historyrecord && $historyrecord.length && $historyrecord.find("img.avatarMe").attr("src", _userInfo.configinfo.server_url + "/" + strUrl);
	//群成员列表
	//更改自己的图片
	if ($("#myTab").children().filter("div.setopacity.setbottomstyle").index() == 1) {
		$("#" + userInfo.id).find("img.avatar").attr("src", userImg);
	}
}