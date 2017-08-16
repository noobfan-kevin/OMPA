var RecentlyUser=function(){
	function createRecentlyList(userinfo,recently,pjId)
	{
		$.ajax(userinfo.configinfo.server_url+"/api/chat/queryRecentlyChat/"+userinfo.id, {
			type: 'get',
			async:false,
			data:"projectId="+pjId,
			success: function(result){
				for(var i=0;i<result.list.length;i++)
				{
					result.list[i].type=0;
					recently.push(result.list[i]);
				}
			},
			error: function(err){
				console.debug("读取失败");
			}
		});
	}
	function createRecentlyGroupList(userinfo,recently,pjId)
	{
		$.ajax(userinfo.configinfo.server_url+"/api/chat/queryRecentlyGroupChat/"+userinfo.id, {
			type: 'get',
			async:false,
			data:"projectId="+pjId,
			success: function(result){
				for(var i=0;i<result.list.length;i++)
				{
					result.list[i].type=1;
					recently.push(result.list[i]);
				}
			},
			error: function(err){
				console.debug("读取失败");
			}
		});
	}
	return {
		getRecently:function(userinfo,pjId){
			var recently=[];
			createRecentlyList(userinfo,recently,pjId);
			createRecentlyGroupList(userinfo,recently,pjId);
			recently = recently.sort(function(prevObj,nextObj){
				return prevObj.chatTime - nextObj.chatTime;
			});
			return recently;
		}
	}
}();