var url=require('url');


//
//var groupmember={
//	"1":{
//		"55af44b5bc2257803e1c46e0":{
//			name:"乔布斯",
//			isonline:true
//		},
//		"55af488d2e4066b4404db478":{
//			name:"加菲猫",
//			isonline:true
//		},
//		"55af50457e9fe7643961b67c":{
//			name:"喜羊羊",
//			isonline:true
//		},
//		"55af42a8bc2257803e1c46df":{
//			name:"小燕子",
//			isonline:true
//		}
//	}
//};
var group=function(){
	return {
		setGroup:function(){
			var div=document.getElementById("linkgroupLayer");
			var ul=document.createElement("ul");
			div.appendChild(ul);
			ul.setAttribute("class","chatSiteBar linkgroupSiteBar");
			for(var i=0;i<groupinfo.length;i++)
			{
				var li=document.createElement("li");
				ul.appendChild(li);
				//<div class="chat_member_group chat_item desaturate">
				var div2=document.createElement("div");
				li.appendChild(div2);
				div2.setAttribute("class","chat_member_group chat_item");
				div2.setAttribute("id",groupinfo[i].id);
				div2.setAttribute("groupinfo",JSON.stringify(groupinfo[i]));
				div2.ondblclick=function(){
					groupTalkWindow(this);
				};
				var innerhmtl="<div class=\"ext\"><p class=\"attr\"></p></div><div class=\"avatar\"><div class=\"avatarBk\"><img class=\"avatar\" src=\"images/avatar.jpg\" alt=\"avatar.png\">";
				innerhmtl=innerhmtl+"</div></div><div class=\"info\"><h3 class=\"nickname\"><span class=\"nickname_text\">"+groupinfo[i].name+"</span></h3></div>";
				div2.innerHTML=innerhmtl;
			}
		},
		setGroupMember:function(id){
			$("#member_list").children("chatSiteBar").empty();
			//var div=document.getElementById("member_list");
			//
			//while(div.childNodes.length!==0)
			//{
			//	div.removeChild(div.childNodes[0]);
			//}
			var groupInfo=mainWindow.window.getGroupUser(id);


			//var li=document.createElement("li");

			/*
			<li>
                    <div class="chat_member_group chat_item">
                        <div class="ext"><p class="attr">15:13</p></div>
                        <div class="avatar">
                            <div class="avatarBk">
                                <img class="avatar" src="images/avatar.jpg" alt="avatar.png"/>
                            </div>
                        </div>
                        <div class="info"><h3 class="nickname"><span class="nickname_text">王丽娜</span></h3></div>
                    </div>
                </li>
			
			*/

		}
	}
}();

//聊天代码
//var userInfo=null;
//console.log(decodeURIComponent(window.location.search));
//userInfo = JSON.parse(decodeURIComponent());