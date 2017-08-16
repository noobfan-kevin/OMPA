var fileope=function(){
	var fs = require('fs'); 
	var headerId ="";
	var pagetype;
	var userInfo = JSON.parse(localStorage.getItem('userInfo'));
	var mainWindow=null;
	var projectId=0;
	var project_level2="";
	function writeFile(filename,content)
	{
		fs.writeFileSync(filename, content);
	}
	function updateRecordInfo(recordid,filename,originalName,savefn)
	{
		var recorditem=[];
		var obj={};
		obj.originalName=originalName;
		obj.savefn=savefn;
		recorditem.push(obj);
		var str="file___"+JSON.stringify(recorditem);
		console.debug(recorditem);
		if(!pagetype)
		{
			chatHistorys.upPersonalChat(recordid,str,2);
		}
		else
		{
			chatHistorys.upGroupChat(recordid,str,2);
		}
	}
	function sendFile(files,spanid,type) {
		  if (!files || files.length < 1) {
				return;
		  }
		  if(files[0].type.indexOf("image")<0){
			  $("#talk_content").scrollTop(Number.MAX_VALUE);
		  }
		  var percent = document.getElementById(spanid);

		  var formData = new FormData();             // 创建一个表单对象FormData
		  formData.append( 'submit', '中文' );  // 往表单对象添加文本字段
		  if(type)
		  {
				var groupId_2 = $("#talkgroup").children(".setopacity").attr("id");
		  }
		  var fileNames = '' ;
		  
		  for (var i = 0; i < files.length; i++) {
				var file = files[i];
				formData.append( 'file' , file); 
		  }
		  
		  var xhr = new XMLHttpRequest();
		  xhr.upload.addEventListener( 'progress',
				 function uploadProgress(evt) {
					   // evt 有三个属性：
					   // lengthComputable – 可计算的已上传字节数
					   // total – 总的字节数
					   // loaded – 到目前为止上传的字节数
					   if (evt.lengthComputable) {
							var percent2=Math.round((evt.loaded / evt.total)  * 100);
							percent.style.cssText="width:"+percent2+"%";
							percent.childNodes[0].innerHTML=percent2+"%";
					  }
				}, false); // false表示在事件冒泡阶段处理

		  xhr.upload.onload = function() {
				percent.innerHTML = fileNames + '文件传输完成。' ;
		  };

		  xhr.upload.onerror = function(e) {
				percent.innerHTML = "<span style=\"color:#FF0000\">"+fileNames + " 文件传输失败，网络连接超时</span>" ; 
		  };
		  xhr.onreadystatechange=function(){
			if (xhr.readyState==4)
			{
				  if (xhr.status==200)
				  {
					// console.debug(xhr.responseText);
					  var fileinfo=JSON.parse(xhr.responseText);
					  var userId2 = $("#talkusers").children(".setopacity").attr("id");
					  ////console.debug(percent.parentNode.parentNode.parentNode.parentNode.childNodes);
					  if(files[0].type.indexOf("image")<0) 
					  {
						  //percent.parentNode.parentNode.parentNode.parentNode.childNodes[0].innerHTML="<i class=\"iconfont\">&#xe641;</i>";
						  percent.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].style.display="none";
						  var fileinfo=JSON.parse(xhr.responseText);
						  var divstr="file___["+xhr.responseText+"]";
						  ////console.debug(fileinfo);
						  if(!type)
						  {
							  if(!percent.getAttribute("status")) {
								  percent.parentNode.parentNode.parentNode.parentNode.childNodes[0].innerHTML="<i style=\"cursor:default\" class=\"iconfont\">&#xe641;</i>";
								  percent.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[2].innerHTML="<span>已发送</span>";
								 	mainWindow.window.personalChat.sentMessage($("#talkusers").children(".setopacity").attr("id"), divstr,projectId);
								 	var chat_time=new Date().toLocaleString();
								 	chatHistorys.addPersonalChat(userInfo.id,userId2, "<div>文件："+fileinfo.originalName+"<span id=\""+fileinfo._id+"\"></span></div>",projectId);
								  	$("#talk_content").scrollTop(Number.MAX_VALUE);
							  }
							 else
							  {
								  deleteCancelFile(fileinfo.id);
							  }
						  }
						  else
						  {
							  if(!percent.getAttribute("status")) {
								  percent.parentNode.parentNode.parentNode.parentNode.childNodes[0].innerHTML="<i style=\"cursor:default\" class=\"iconfont\">&#xe641;</i>";
								  percent.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[2].innerHTML="<span>已发送</span>";
									var groupId2 = $("#talkgroup").children(".setopacity").attr("id");
									mainWindow.window.mainContain.sendGroupMess(groupId2, divstr,projectId);
									var chat_time=new Date().toLocaleString();
									chatHistorys.addGroupChat(groupId2, userInfo.id, "<div>文件：" + fileinfo.originalName + "<span id=\"" + fileinfo._id + "\"></span></div>");
								  $("#talk_content").scrollTop(Number.MAX_VALUE);
							  }
							  else
							  {
								  deleteCancelFile(fileinfo.id);
							  }
						  }
						  
					  }
					  else {
						  var div = percent.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
						  div.removeChild(percent.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
						  document.getElementById("chackTextarea-area").focus();
						  //document.getElementById("chackTextarea-area").innerHTML=document.getElementById("chackTextarea-area").innerHTML+
						  var html = "";
						  if(document.getElementById("chackTextarea-area").innerHTML!==""){
							  html=document.getElementById("chackTextarea-area").innerHTML+"<br><img style=\"vertical-align:bottom;max-width: 100%\" title=\"双击可打开\" file__name=\""+fileinfo.originalName+"\" id=\"" + fileinfo.name + "\" src=\"" + userInfo.configinfo.server_url + "/" + fileinfo.name + "\"/ ondblclick=\"fileope.openImage(this)\">";
						  }
						  else{
							  html="<img style=\"vertical-align:bottom;max-width: 100%\" title=\"双击可打开\" file__name=\""+fileinfo.originalName+"\" id=\"" + fileinfo.name + "\" src=\"" + userInfo.configinfo.server_url + "/" + fileinfo.name + "\"/ ondblclick=\"fileope.openImage(this)\">";
						  }
						  document.getElementById("chackTextarea-area").innerHTML="";
						  document.execCommand("InsertHtml", false, html);
						  document.execCommand("InsertParagraph");
						  var $chatTextarea = $("#chackTextarea-area").css({height: '86px', overflowY: 'scroll'});
						  setTimeout(function(){
							  $chatTextarea.scrollTop(Number.MAX_VALUE);
						  },50);
					  }

				  }
				  else
				  {
						////console.debug("失败");
				  }
			 }
		  };
		  xhr.open( 'post', userInfo.configinfo.server_url+'/api/file/upload' , true);
		  xhr.send(formData);            // 发送表单对象。
		  function deleteCancelFile(id){
			  $.ajax(userInfo.configinfo.server_url+"/api/file/"+id, {
				  type: 'delete',
				  success: function(result){
					  //console.debug("成功");
				  },
				  error: function(err){
					  //console.debug("失败");
				  }
			  });
		  }
	}
	return {
		writeNoLine:function(userinfo,talkid,records){
			////////console.debug(talkid);
			var _this=this;
			var path = require("path");
			var record_path=path.dirname(process.execPath);
			record_path=record_path+"/record/"+userinfo.id+"/"+talkid;
			this.createPath(record_path);
			fs.exists(record_path+"/"+_this.getDate(), function(exists) {
				////console.log(exists);
				var recordInfo=[];
				if(exists)
				{
					fs.readFile(record_path+"/"+_this.getDate(),'utf-8', function(err, data){ 
						 if(err)
						 { 
							////console.log('读取文件失败'); 
						 }
						 else
						 { 
							try
							{
								recordInfo=JSON.parse(data); 
							}
							catch (e)
							{
								recordInfo=[];
							}
							for(var i=0;i<records.length;i++)
							{
								var date=records[i].date;
								if(!date)
								{
									date=new Date().toLocaleString();
								}
								recordInfo.push({
									id:records[i].sender,
									message:records[i].msg,
									date:date
								})
							}
							//////console.log(JSON.stringify(recordInfo));
							writeFile(record_path+"/"+_this.getDate(),JSON.stringify(recordInfo));
						 } 
					});
				}
				else
				{
					for(var i=0;i<records.length;i++)
					{
						var date=records[i].date;
						if(!date)
						{
							date=new Date().toLocaleString();
						}
						recordInfo.push({
							id:records[i].sender,
							message:records[i].msg,
							date:date
						})
					}
					writeFile(record_path+"/"+_this.getDate(),JSON.stringify(recordInfo));
				} 
			});
		},
		writeRecord:function(userinfo,message, sender,date,type){
			//////console.log(userinfo);
			var _this=this;
			var path = require("path");
			var record_path=path.dirname(process.execPath);
			record_path=record_path+"/record/"+userinfo.id+"/"+sender;
			this.createPath(record_path);
			var speaker_id=sender
			if(type)
			{
				speaker_id=userinfo.id;
			}
			var recordInfo=[];
			if(fs.existsSync(record_path+"/"+_this.getDate()))
			{
				var recordstr=fs.readFileSync(record_path+"/"+_this.getDate(),'utf-8');
				try
				{
					recordInfo=JSON.parse(recordstr); 
				}
				catch (e)
				{
					recordInfo=[];
				}
				recordInfo.push({
					id:speaker_id,
					message:message,
					date:date
				});
				writeFile(record_path+"/"+_this.getDate(),JSON.stringify(recordInfo));
			}
			else
			{
				recordInfo.push({
					id:speaker_id,
					message:message,
					date:date
				});
				writeFile(record_path+"/"+_this.getDate(),JSON.stringify(recordInfo));
			}
			createIndexFile(_this.getDate());
			return JSON.stringify({id:recordInfo.length-1,filename:_this.getDate()});
			function createIndexFile(dateStr)
			{
				if(!fs.existsSync(record_path+"/index"))
				{
					var indexArray=[];
					indexArray.push(dateStr);
					writeFile(record_path+"/index",JSON.stringify(indexArray));	
				}
				else
				{
					var indexstr=fs.readFileSync(record_path+"/index",'utf-8');
					var indexArray=JSON.parse(indexstr);
					var flag=false;
					for(var i=0;i<indexArray.length;i++)
					{
						if((""+dateStr)===indexArray[i])
						{
							flag=true;
							break;
						}
					}
					if(!flag)
					{
						indexArray.push(dateStr);
						writeFile(record_path+"/index",JSON.stringify(indexArray));	
					}
				}
			}
		},
		writeRecordGroup:function(userinfo,message, group,date,senderid){
			//////console.log(userinfo);
			var _this=this;
			var path = require("path");
			var record_path=path.dirname(process.execPath);
			record_path=record_path+"/record/"+userinfo.id+"/"+group;
			this.createPath(record_path);
			var speaker_id=senderid;
			var recordInfo=[];
			if(fs.existsSync(record_path+"/"+_this.getDate()))
			{
				var recordstr=fs.readFileSync(record_path+"/"+_this.getDate(),'utf-8');
				try
				{
					recordInfo=JSON.parse(recordstr); 
				}
				catch (e)
				{
					recordInfo=[];
				}
				recordInfo.push({
					id:speaker_id,
					message:message,
					date:date
				});
				writeFile(record_path+"/"+_this.getDate(),JSON.stringify(recordInfo));
			}
			else
			{
				recordInfo.push({
					id:speaker_id,
					message:message,
					date:date
				});
				writeFile(record_path+"/"+_this.getDate(),JSON.stringify(recordInfo));
			}
			createIndexFile(_this.getDate());
			return JSON.stringify({id:recordInfo.length-1,filename:_this.getDate()});
			function createIndexFile(dateStr)
			{
				if(!fs.existsSync(record_path+"/index"))
				{
					var indexArray=[];
					indexArray.push(dateStr);
					writeFile(record_path+"/index",JSON.stringify(indexArray));	
				}
				else
				{
					var indexstr=fs.readFileSync(record_path+"/index",'utf-8');
					var indexArray=JSON.parse(indexstr);
					var flag=false;
					for(var i=0;i<indexArray.length;i++)
					{
						if((""+dateStr)===indexArray[i])
						{
							flag=true;
							break;
						}
					}
					if(!flag)
					{
						indexArray.push(dateStr);
						writeFile(record_path+"/index",JSON.stringify(indexArray));	
					}
				}
			}
			/*fs.exists(record_path+"/"+_this.getDate(), function(exists) {
				////console.log(exists);
				var recordInfo=[];
				if(exists)
				{
					fs.readFile(record_path+"/"+_this.getDate(),'utf-8', function(err, data){ 
						 if(err)
						 { 
							////console.log('读取文件失败'); 
						 }
						 else
						 { 
							try
							{
								recordInfo=JSON.parse(data); 
							}
							catch (e)
							{
								recordInfo=[];
							}
							
							recordInfo.push({
								id:speaker_id,
								message:message,
								date:date
							});
							writeFile(record_path+"/"+_this.getDate(),JSON.stringify(recordInfo));
						 } 
					});
				}
				else
				{
					recordInfo.push({
						id:speaker_id,
						message:message,
						date:date
					});
					writeFile(record_path+"/"+_this.getDate(),JSON.stringify(recordInfo));
				} 
			});*/
			/*fs.writeFile(filename, countent,"utf-8", function(err){ 
				 if(err)
				 { 
					////console.log('写入文件失败'); 
				 }
				 else
				 { 
					////console.log('保存成功'); 
				 } 
			}); */
		},
		getDate:function(){
			var today = new Date();      
			var day = ""+today.getDate();      
			var month = ""+(today.getMonth() + 1);      
			var year = today.getFullYear();   
			if(month.length===1)
			{
				month="0"+month;
			}
			if(day.length===1)
			{
				day="0"+day;
			}
			var date = year + "" + month + "" + day; 
			return date;
		},
		createPath:function(filepath){
			var path = require("path");
			mkdirsSync(filepath);
			function mkdirsSync(dirname){
				if(fs.existsSync(dirname)){
					return true;
				}else{
					if(mkdirsSync(path.dirname(dirname), true)){
						fs.mkdirSync(dirname, true);
						return true;
					}
				}
			}
		},
		readFileNormal:function(path){
			var content=fs.readFileSync(path,'utf-8');
			return content;
		},
		readConfigFile:function(){
			var path = require("path");
			var config_path=path.dirname(process.execPath);
			fs.readFile(config_path+"/app/chat_config/config.json",'utf-8', function(err, data){
				 if(err){ 
					////console.log('读取文件失败'); 
				 }else{ 
					configinfo=JSON.parse(data); 
				 } 
			});
		},
		fileUpload:function(type){
			pagetype=type;
			$(window).on('dragover', function (e) {
				e.preventDefault();
				e.originalEvent.dataTransfer.dropEffect = 'none';
			});
			$(window).on('drop', function (e) {
				e.preventDefault();
			});
			$(document).on('dragstart', 'a', function (e) {
				e.preventDefault();
			});
			$(document).on('dragstart', 'img', function (e) {
				e.preventDefault();
			});
			$("#imagecon").on("click",function(e){
				e.stopPropagation();
				$("#imageupload").click();
			});
			document.addEventListener("dragover", function(e) {
				  e.stopPropagation();
				  e.preventDefault();
			}, false);
			$('#chackTextarea-area').on('paste', function(e){
				e.preventDefault();
				var text= e.originalEvent.clipboardData.getData('text/plain');
				text = text.replace(/\r\n/g,"<br>");
				text=text.replace(/\s+/g, "&nbsp;");
				document.execCommand('insertHTML', false, text);
			});
			document.addEventListener("drop", function(e) {
				 ////console.debug(e.dataTransfer.files);
				  e.stopPropagation();
				  e.preventDefault();
				  for(var i=0;i<e.dataTransfer.files.length;i++)
				  {
					  var spanid=new Date().getTime()+i;
					  var div=document.createElement("div");
					  div.setAttribute("class","chat_content_group me");
					  //if(files[0].type.indexOf("image")<0)
					  ////console.debug(e.dataTransfer.files[i].type);
					  if(e.dataTransfer.files[i].type.indexOf("image")>=0)
					  {
						  div.style.display="none";
					  }
					  var div_content="<p class=\"time\">"+new Date().toLocaleString()+"</p><div class=\"avatarBk\">";
					  div_content=div_content+"<img src=\""+userInfo.configinfo.server_url+"/"+userInfo.image+"\" class=\"avatar\" class=\"chat_content_avatar\"><span class=\"name\">"+userInfo.chinese_name+"</span>";
					  div_content=div_content+"</div>";
					  div_content=div_content+"<h3 class=\"chat_content\">";
					  div_content=div_content+"<div class=\"chatpl\">";
					  div_content=div_content+"<div class=\"upload-fileico\">";
					  div_content=div_content+"</div>";
					  div_content=div_content+"<div class=\"upload-fileinfo\">";
					  div_content=div_content+"<span class=\"filename\">"+e.dataTransfer.files[i].name+"</span>";
					  div_content=div_content+"<div class=\"wrapper\">";
					  div_content=div_content+"<div class=\"load-bar\">";
					  div_content=div_content+"<div id=\""+spanid+"\" class=\"load-bar-inner\" style=\"width:0%\"><span>0%</span></div>";
					  div_content=div_content+"</div>";
					  div_content=div_content+"</div>";
					  div_content=div_content+"<div class=\"fileaction\">";
					  div_content=div_content+"<span style=\"cursor: pointer;\" onclick=\"fileope.cancelUpload("+spanid+")\">取消</span>";
					  div_content=div_content+"</div>";
					  div_content=div_content+"</div>";
					  div_content=div_content+"</div>";
					  // div_content=div_content+"<p class=\"chat_time\">"+new Date().toLocaleString()+"</p>";
					  div_content=div_content+"</h3>";
					  div.innerHTML=div_content;
					  document.getElementById("talk_content").appendChild(div);
					  var fileArray=[];
					  fileArray.push(e.dataTransfer.files[i]);
					  sendFile(fileArray,spanid,type);
				  }
				  //div.innerHTML="";
			}, false);
		},
		upload:function(input,type){
			var files = input.files;
			for(var i=0;i<files.length;i++)
			{
				var spanid=new Date().getTime()+i;
				var div=document.createElement("div");
				div.setAttribute("class","chat_content_group me");
				if(files[i].type.indexOf("image")>=0){
					div.style.display="none";
				}
				var div_content="<p class=\"time\">"+new Date().toLocaleString()+"</p><div class=\"avatarBk\">";
				div_content=div_content+"<img src=\""+userInfo.configinfo.server_url+"/"+userInfo.image+"\" class=\"avatar\" class=\"chat_content_avatar\"><span class=\"name\">"+userInfo.chinese_name+"</span>";
				div_content=div_content+"</div>";
				div_content=div_content+"<h3 class=\"chat_content\">";
				div_content=div_content+"<div class=\"chatpl\">";
				div_content=div_content+"<div class=\"upload-fileico\">";
				div_content=div_content+"</div>";
				div_content=div_content+"<div class=\"upload-fileinfo\">";
				div_content=div_content+"<span class=\"filename\">"+files[i].name+"</span>";
				div_content=div_content+"<div class=\"wrapper\">";
				div_content=div_content+"<div class=\"load-bar\">";
				div_content=div_content+"<div id=\""+spanid+"\" class=\"load-bar-inner\" style=\"width:0%\"><span>0%</span></div>";
				div_content=div_content+"</div>";
				div_content=div_content+"</div>";
				div_content=div_content+"<div class=\"fileaction\">";
				div_content=div_content+"<span style=\"cursor: pointer;\" onclick=\"fileope.cancelUpload("+spanid+")\">取消</span>";
				div_content=div_content+"</div>";
				div_content=div_content+"</div>";
				div_content=div_content+"</div>";
				// div_content=div_content+"<p class=\"time\">"+new Date().toLocaleString()+"</p>";
				div_content=div_content+"</h3>";
				div.innerHTML=div_content;
				document.getElementById("talk_content").appendChild(div);
				var fileArray=[];
				fileArray.push(files[i]);
				sendFile(fileArray,spanid,type);
			}
			$("#imageupload").val('');
		},
		cancelUpload:function(id){
			var process=document.getElementById(""+id);
			process.setAttribute("status","cancel");
			process.parentNode.parentNode.parentNode.parentNode.childNodes[0].innerHTML="";
			process.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].style.display="none";
			process.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[2].innerHTML="<span>取消发送</span>";
		},
		download:function(input,originalName)
		{
			var progress=input.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0];
			var url = require('url');
			var http = require('http');
			var file_url=userInfo.configinfo.server_url+"/"+progress.id;
			var inputcontain=input.parentNode;
			var path = input.value;

			var originalNameArr = originalName.split('.');
			if(originalNameArr.length > 1) {
				var originalExtensionName = originalNameArr[originalNameArr.length - 1];
				var NewNameArr = path.split('.');
				var NewExtensionName = NewNameArr[NewNameArr.length - 1];
				if (NewExtensionName != originalExtensionName) {
					path = path + '.' + originalExtensionName;
				}
			}

			inputcontain.childNodes[1].style.cursor="pointer";
			inputcontain.childNodes[1].innerHTML="取消";
			inputcontain.childNodes[1].onclick=function(){};
			input.style.display="none";
			var options = {
				host: url.parse(file_url).host.split(":")[0],
				port: url.parse(file_url).port,
				path: url.parse(file_url).pathname
			};
			/*if(inputcontain.childNodes.length===6)
			{
                console.debug(inputcontain.childNodes[5]);
				inputcontain.removeChild(inputcontain.childNodes[5]);
			}*/
			var file_name = url.parse(file_url).pathname.split('/').pop();
			var file = fs.createWriteStream(path);
			var isfiledown=true;
			var request=http.get(file_url, function(res) {
				var fsize = res.headers['content-length'];
                inputcontain.childNodes[1].onclick=function(){
					isfiledown=false;
				};
				res.on('data', function(data) {
						if(isfiledown){
							file.write(data);
							var value2=100-(((fsize-file.bytesWritten)/fsize)*100);
							value2=Math.ceil(value2);
							progress.style.cssText="width:"+value2+"%";
							progress.parentNode.childNodes[1].innerHTML=value2+"%";
						}
						else{
							this.end();
						}
					}).on('end', function() {
						if(!isfiledown){
                            inputcontain.childNodes[1].style.cursor ='default' ;
							inputcontain.childNodes[1].innerHTML='<span style="height:24px; width:70px; z-index:100;color:#000000;cursor:pointer;" onclick="fileope.saveAs(this,1);">另存为</span>';
							inputcontain.childNodes[0].onclick=function(){
								input.click();
							};
							// input.style.display="block";
                            progress.parentNode.childNodes[1].innerHTML="0%";
							progress.style.cssText="width:0%";
							isfiledown=true;
							input.value="";
							return;
						}
						var recordid=input.getAttribute("recordid");
						var filename=input.getAttribute("filename");
						progress.style.cssText="width:100%";
						progress.parentNode.childNodes[1].innerHTML="100%";
                        inputcontain.childNodes[1].style.display="block";
                        inputcontain.childNodes[1].style.fontSize="12px";
                        inputcontain.childNodes[1].innerHTML="";
						if(inputcontain.childNodes[1].innerHTML.indexOf("fileope.openFile")<0)
						{
							// inputcontain.childNodes[3].childNodes[0].innerHTML="&nbsp;";
                        var span1 = '<span filename="'+path+'" style="height:24px; width:70px;z-index:100;color:#000000;cursor:pointer;margin-left: 10px;" onclick="fileope.openFile(this);">打开</span>';
                        var span2 = '<span filename="'+path+'" style="height:24px; width:70px;z-index:100;color:#000000;cursor:pointer;margin-left: 10px;" onclick="fileope.openPath(this);">打开目录</span>';
                            $(inputcontain.childNodes[1]).append(span1);
                            $(inputcontain.childNodes[1]).append(span2);
						}
						input.style.display="none";
						/*input.value="";
                            inputcontain.childNodes[1].innerHTML="另存为";
                            inputcontain.childNodes[1].onclick=function(){
							fileope.saveAs(this,1);
						};*/
						updateRecordInfo(recordid,filename,originalName,path);
						file.end();
						if(!pagetype){
							var userId2 = $("#talkusers").children(".setopacity").attr("id");
						}
					});
				});
				request.on('error', function(e) {
					if(isfiledown){
						inputcontain.childNodes[3].style.display="block";
						inputcontain.childNodes[3].style.fontSize="12px";
						var div=document.createElement("div");
						div.innerHTML="<span style=\"font-size:12px;color:#FF0000;\">失败，网络断开或文件不存在</span>";
						inputcontain.appendChild(div);
					}
				});
		},
		recordDownload:function(input,originalName)
		{
			var progress=input.parentNode.childNodes[1].childNodes[0].childNodes[0];
			var url = require('url');
			var http = require('http');
			var file_url=userInfo.configinfo.server_url+"/uploads/"+progress.id;
			var inputcontain=input.parentNode;
			var options = {
				host: url.parse(file_url).host.split(":")[0],
				port: url.parse(file_url).port,
				path: url.parse(file_url).pathname
			};
			var path = input.value;
			var originalNameArr = originalName.split('.');
			if(originalNameArr.length > 1) {
				var originalExtensionName = originalNameArr[originalNameArr.length - 1];
				var NewNameArr = path.split('.');
				var NewExtensionName = NewNameArr[NewNameArr.length - 1];
				if (NewExtensionName != originalExtensionName) {
					path = path + '.' + originalExtensionName;
				}
			}
			//inputcontain.childNodes[4].style.display="none";
			inputcontain.childNodes[4].childNodes[0].style.cursor="pointer";
			inputcontain.childNodes[4].childNodes[0].innerHTML="取消";

			if(inputcontain.childNodes.length===6)
			{
				inputcontain.removeChild(inputcontain.childNodes[5]);
			}
			var isfiledown=true;
			var file_name = url.parse(file_url).pathname.split('/').pop();
			var file = fs.createWriteStream(path);
			var request=http.get(file_url, function(res) {
				var fsize = res.headers['content-length'];
				inputcontain.childNodes[4].childNodes[0].onclick=function(){
					isfiledown=false;
				}
				res.on('data', function(data) {
						if(isfiledown) {
							file.write(data);
							var value2 = 100 - (((fsize - file.bytesWritten) / fsize) * 100);
							value2 = Math.ceil(value2);
							progress.style.cssText = "width:" + value2 + "%";
							progress.parentNode.childNodes[1].innerHTML = value2 + "%";
						}
						else{
							this.end();
						}
					}).on('end', function() {
						if(!isfiledown){
							inputcontain.childNodes[4].childNodes[0].innerHTML="另存为";
							inputcontain.childNodes[4].childNodes[0].onclick=function(){
								fileope.saveAs(this);
							}
							progress.parentNode.childNodes[1].innerHTML="0%";
							progress.style.cssText="width:0%";
							isfiledown=true;
							input.value="";
							return;
						}
						var recordid=input.getAttribute("recordid");
						var filename=input.getAttribute("filename");
						//var originalName=input.getAttribute("originalName");
						inputcontain.childNodes[4].style.display="block";
						progress.style.cssText="width:100%";
						progress.parentNode.childNodes[1].innerHTML="100%";
						inputcontain.childNodes[4].innerHTML="<div class=\"fileaction\"><span filename=\""+path+"\" style=\"cursor:pointer;color:#000000;\" onclick=\"fileope.openFile(this)\">打开</span>&nbsp;&nbsp;&nbsp;&nbsp;<span filename=\""+path+"\" style=\"cursor:pointer;color:#000000;\" onclick=\"fileope.openPath(this)\">打开目录</span></div>";
						updateRecordInfo(recordid,filename,originalName,path);
						input.parentNode.removeChild(input);
						file.end();
					});
				});
				request.on('error', function(e) {
					if(isfiledown) {
						var div = document.createElement("div");
						div.innerHTML = "<span style=\"font-size:12px;color:#FF0000;\">失败，网络断开或文件不存在</span>";
						inputcontain.appendChild(div);
					}
				});
		},
		openPath:function(contain){
			var gui = require('nw.gui');
			var shell = gui.Shell;
			shell.showItemInFolder(contain.getAttribute("filename"));
		},
		openFile:function(contain){
			var gui = require('nw.gui');
			var shell = gui.Shell;
			shell.openItem(contain.getAttribute("filename"));
		},
		openImage:function(contain) 
		{
			//var gui = require('nw.gui');
			//var shell = gui.Shell;
			//shell.openExternal(userInfo.configinfo.server_url+"/public/"+contain.id);
			////console.debug(contain);
			var gui = require('nw.gui');
			var imagewin = gui.Window.open('displayImage.html', {
				position: 'left',
				width: 1024,
				height: 768,
				toolbar: true,
				frame:false,
				show:false
			});
			imagewin.on('loaded', function () {
				imagewin.window.setImage(contain.src);
				imagewin.window.setImageName(contain.getAttribute("file__name"));
				imagewin.show();
				//imagewin.enterFullscreen();
			});
		},
		sendCuteImage:function(imageinfo,type){
			////console.debug(imageinfo);
			var html="";
			if(document.getElementById("chackTextarea-area").innerHTML===""){
				html="<img style=\"vertical-align: bottom;max-width: 100%;\" id=\""+imageinfo.name+"\" file__name=\""+imageinfo.originalName+"\" title =\"双击可打开\" src=\""+userInfo.configinfo.server_url+"/"+imageinfo.name+"\"  ondblclick=\"fileope.openImage(this)\"/>";  //<div><img src=\""+userInfo.configinfo.server_url+"/public/"+fileinfo.name+"\" /></div>
			}
			else{
				html=document.getElementById("chackTextarea-area").innerHTML+"<br><img style=\"vertical-align: bottom;max-width: 100%;\" id=\""+imageinfo.name+"\" file__name=\""+imageinfo.originalName+"\" title =\"双击可打开\" src=\""+userInfo.configinfo.server_url+"/"+imageinfo.name+"\"  ondblclick=\"fileope.openImage(this)\"/>";  //<div><img src=\""+userInfo.configinfo.server_url+"/public/"+fileinfo.name+"\" /></div>
			}
			document.getElementById("chackTextarea-area").innerHTML="";
			document.getElementById("chackTextarea-area").focus();
			document.execCommand("InsertHtml", false,html);
			document.execCommand("InsertParagraph");
			var $chatTextarea = $("#chackTextarea-area").css({height: '86px', overflowY: 'scroll'});
			setTimeout(function(){
				$chatTextarea.scrollTop(Number.MAX_VALUE);
			},50);
		},
		cutImage:function(type){
			var exec = require('child_process').exec;
			exec('nircmd.exe savescreenshot app/screen1.png', 
				function (error, stdout, stderr){ 
					var gui = require('nw.gui');
					var imagewin = gui.Window.open('imageEdit.html', { 
						position: 'left',
						width: 860,
						height: 600,
						toolbar: false,
						frame:false,
						show:false
					});
					imagewin.on('loaded', function () {
						imagewin.window.setMainWindow(gui.Window.get());
						imagewin.window.setType(type);
						imagewin.show();
						imagewin.enterFullscreen();
					});
				}
			);
		},
		writeOffLineEndTimeInfo:function(userid,content){
			var path = require("path");
			var record_path=path.dirname(process.execPath);
			record_path=record_path+"/"+userid;
			this.createPath(record_path);
			record_path=record_path+"/offLinetime.txt"
			writeFile(record_path,content)
		}, 
		readOffLineEndTimeInfo:function(userid){
			var path = require("path");
			var result="";
			var record_path=path.dirname(process.execPath);
			$.ajax({
                type : 'get',
                url : userid+"/offLinetime.txt",
				async:false,
                success : function(data) { 
                    result=data;
                },
                error:function(data){
                   ////////console.debug("没有文件");
                }
            });
			return result;
		},
		getIndexLast:function(path,date){
			var result="";
			if(!fs.existsSync(path+"/index"))
			{
				result=this.getDate();
			}
			else
			{
				var indexstr=fs.readFileSync(path+"/index",'utf-8');
				try
				{
					var indexArray=JSON.parse(indexstr);
					var flag=false;
					for(var i=0;i<indexArray.length;i++)
					{
						if(indexArray[i]===(""+date))
						{
							flag=true;
							break;
						}
					}
					if(flag)
					{
						result=date;
					}
					else
					{
						result=indexArray[indexArray.length-1];
					}
				}
				catch (e)
				{
					result=this.getDate();
				}
			}	
			return result;
		},
		writeUserHistory:function(currentPage) {
			var self = this,
					chat_Userid = $("#talkusers").children(".setopacity").attr("id");	//聊天对象的id
			chatHistorys.paging_personalChat(userInfo.id, chat_Userid, currentPage || 1, function (pageData) {
				var userId = userInfo.id,
						chinese_name = userInfo.chinese_name,
						chat_text = "",
						$parent = $("#history_list").children("ul.chatSiteBar");
				if (!userId) {
					//console.log("读数据时，用户id为undefined");
					return false;
				}
				if (pageData && pageData.data.length) {
					$parent.empty();
				}
				personal_historyPage = pageData["pageCount"];
				$.each(pageData.data, function (index, val) {
					if (userId === val.sender) {
						chinese_name = userInfo.chinese_name;
					}
					else {
						chinese_name = $("#" + val.sender).find(".nickname").text();
					}
					chat_text = val.message;
					if (chat_text.indexOf("file___") >= 0) {//文件特殊处理
						chat_text = self.getFileRecord(val.message, val.id, val.date);
					}
					var userImag = helpHand.getUserImageUrl(val.sender),
							userClass = (userId == val.sender) ? "avatar avatarMe" : "avatar";
					if (project_level2 !== "1" && project_level2 !== "2" && project_level2 !== "3") {
						$parent.append($("<li><div class=\"chat_item chatRecord\"><div class=\"icon-file\">" +
								"<img style=\"display:none;\"  onclick=\"remark.selectNode(this)\">" +
								"</div><div class=\"avatar\"><div class='avatarBk'>" +
								"<img class='"+userClass+"' src=\"" + userImag + "\" alt=\"avatar.png\"/></div></div>" +
								"<div class=\"chatinfo\"><span class=\"chat_name\">" + chinese_name + "</span>" +
								"<span class=\"chat_date\">" + new Date(val.date).toLocaleString() + "</span>" +
								"<div class=\"chat_text\"><span>" + chat_text + "</span></div></div></div></li>"));
					}
					else {
						$parent.append($("<li><div class=\"chat_item chatRecord\"><div class=\"icon-file\">" +
								"<img onclick=\"remark.selectNode(this)\">" +
								"</div><div class=\"avatar\"><div class='avatarBk'>" +
								"<img class='"+userClass+"' src=\"" + userImag + "\" alt=\"avatar.png\"/></div></div>" +
								"<div class=\"chatinfo\"><span class=\"chat_name\">" + chinese_name + "</span>" +
								"<span class=\"chat_date\">" + new Date(val.date).toLocaleString() + "</span>" +
								"<div class=\"chat_text\"><span>" + chat_text + "</span></div></div></div></li>"));
					}
				})
			});
		},
		writeGroupHistory:function(date){
			var _this=this;
			var fs = require('fs'); 
			var path = require("path");
			var div=document.getElementById("history_list");
			////console.log(div.childNodes)
			while(div.childNodes.length!==0)
			{
				div.removeChild(div.childNodes[0]);
			}
			var record_path=path.dirname(process.execPath);
			var userId2 = $("#talkgroup").children("div.setopacity").attr("id");
			headerId=userId2;
			record_path=record_path+"/record/"+userInfo.id+"/"+userId2;
			date=this.getIndexLast(record_path,date);
			fs.readFile(record_path+"/"+date,'utf-8', function(err, data){
				 if(err)
				 { 
					////console.log('读取文件失败'); 
				 }
				 else
				 { 
					var recordInfo=JSON.parse(data); 
					//////console.log(recordInfo)
					var ul=document.createElement("ul");
					div.appendChild(ul);
					ul.setAttribute("class","chatSiteBar");
					for(var i=0;i<recordInfo.length;i++)
					{
						var li=document.createElement("li");
						ul.appendChild(li);
						var div1="<div class=\"chatRecord chat_item\">";
						div1=div1+"<div class=\"chb\"><img src=\"images/black.png\"></div>";
						div1=div1+"<div class=\"avatar\">";
						div1=div1+"";
						div1=div1+"</div>";
						div1=div1+"<div class=\"chatinfo\">";
						var name2=getSenderUserInfo(recordInfo[i].id);
						var name3="";
						if(name2&&name2!==null&&name2!==""&&name2!=="null")
						{
							name3=JSON.parse(name2).chinese_name;
						}
						else
						{
							name3=recordInfo[i].id;
						}
						div1=div1+"<span class=\"chat_name\">"+name3+"</span>";
						div1=div1+"<span class=\"chat_date\">"+recordInfo[i].date+"</span>";
						//div1=div1+"<div class=\"chat_text\"><span>"+recordInfo[i].message+"</span></div>";
						if(recordInfo[i].message.indexOf("file___")<0)
						{
							div1=div1+"<div class=\"chat_text\"><span>"+recordInfo[i].message+"</span></div>";
						}
						else
						{
							div1=div1+"<div class=\"chat_text\">"+_this.getFileRecord(recordInfo[i].message,i,date)+"</div>";
						}
						div1=div1+"</div>";
						div1=div1+"</div>";
						li.innerHTML=div1;
					}
					//ul.scrollTop = ul.scrollHeight;
				 } 
			});
		},
		saveAs:function(contain,type){
			////console.debug(contain.parentNode.parentNode.childNodes[3]);
			//document.getElementById(id).click();
			if(!type){
                console.log('1')
				contain.parentNode.parentNode.childNodes[3].click();
			}
			else{
                console.log(contain);
				contain.parentNode.parentNode.childNodes[0].click();
				// contain.parentNode.parentNode.childNodes[2].click();
			}
		},
        // todo 历史记录里面样式
		getFileRecord:function(message,id,filename){
			var result="";
			message=message.replace("file___","");
			var obj=JSON.parse(message)[0];
			////////console.debug(obj); 
			if(obj.savefn)
			{
				result="<div style=\"white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">"+obj.originalName+"</div>";
				result=result+"<div class=\"fileaction\"><span filename=\""+obj.savefn+"\" style=\"cursor:pointer;color:#000000;\" onclick=\"fileope.openFile(this)\">打开</span>&nbsp;&nbsp;&nbsp;&nbsp;<span filename=\""+obj.savefn+"\" style=\"cursor:pointer;color:#000000;\" onclick=\"fileope.openPath(this)\">打开目录</span></div>";
			}
			else
			{
				//result=message;
				var result="<div style=\"white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">"+obj.originalName+"</div>";//<span id=\""+fileinfo.name+"\"></span>
				result=result+"<div class=\"wrapper\" style=\"margin-bottom:20px;\"><div class=\"load-bar\"><div id=\""+obj.name+"\" class=\"load-bar-inner\" style=\"width:0%\"></div><span>0%</span></div></div>";
				result=result+"<div></div>";
				if(!pagetype)
				{
					result=result+"<input id=\""+id+"\" recordid=\""+id+"\" filename=\""+filename+"\" originalName=\""+obj.originalName+"\" type=\"file\" style=\"display:none;top:88px;width:62px;left:65px;\" class=\"file\" onchange=\"fileope.recordDownload(this,this.nwsaveas)\" nwsaveas=\""+obj.originalName+"\"/><div><span style=\"height:24px; width:70px;z-index:100;color:#000000;\" onclick=\"fileope.saveAs(this)\">另存为</span></div>";
				}
				else
				{
					result=result+"<input id=\""+id+"\" recordid=\""+id+"\" filename=\""+filename+"\" originalName=\""+obj.originalName+"\" type=\"file\" style=\"display:none;top:110px;width:62px;left:42px;\" class=\"file\" onchange=\"fileope.recordDownload(this,this.nwsaveas)\" nwsaveas=\""+obj.originalName+"\"/><div><span style=\"height:24px; width:70px;z-index:100;color:#000000;\" onclick=\"fileope.saveAs(this)\">另存为</span></div>";
				}
			}
			////////console.debug(result);
			return result;
		},
		changeRecordDate:function(addday,type){
			var _this=this;
			var userId2 = headerId;
			var selfid=userInfo.id;
			var path = require("path");
			var record_path=path.dirname(process.execPath);
			record_path=record_path+"/record/"+selfid+"/"+userId2;
			if(fs.existsSync(record_path+"/index"))
			{
				var indexstr=fs.readFileSync(record_path+"/index",'utf-8');
				try
				{
					var indexArray=JSON.parse(indexstr);
					var arrayIndex=0;
					var flag=false;
					for (var i = 0; i < indexArray.length; i++)
					{
						for (var j = 0; j < indexArray.length - i-1; j++)
						{
							if (indexArray[j]> indexArray[j + 1])
							{
								temp = indexArray[j + 1];
								indexArray[j + 1] = indexArray[j];
								indexArray[j] = temp;
							}
						}
					}
					for(var i=0;i<indexArray.length;i++)
					{
						if((""+record_date)===indexArray[i])
						{
							arrayIndex=i;
							flag=true;
							break;
						}
					}
					if(flag)
					{
						arrayIndex=arrayIndex+addday;
					}
					else
					{
						arrayIndex=indexArray.length-1;
					}
					if(arrayIndex>=0&&arrayIndex<indexArray.length)
					{
						record_date=indexArray[arrayIndex];
						if(type)
						{
							_this.writeGroupHistory(record_date);
						}
						else
						{
							_this.writeUserHistory(record_date);
						}
					}
				}
				catch (e)
				{
					////////console.debug(e);
				}				
			}
		},
        // 刚发过来样式
		createFilediv:function(message,recordinfo){
			if(message.indexOf("file___")>=0)
			{
				var fileinfostr=message.substring(message.indexOf("[")+1,message.indexOf("]"));
				fileinfo=JSON.parse(fileinfostr);
				/*var divstr="<div style=\"white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">"+fileinfo.originalName+"</div>";//<span id=\""+fileinfo.name+"\"></span>
				divstr=divstr+"<div class=\"wrapper\" style=\"margin-bottom:20px;\"><div class=\"load-bar\"><div id=\""+fileinfo.name+"\" class=\"load-bar-inner\" style=\"width:0%\"></div><span>0%</span></div></div>";
				divstr=divstr+"<input recordid=\""+JSON.parse(recordinfo).id+"\" filename=\"filename\" originalName=\""+fileinfo.originalName+"\" type=\"file\" style=\"top:70px;width:45px;overflow: hidden;display:none;\" class=\"file\" onchange=\"fileope.download(this,this.nwsaveas)\" nwsaveas=\""+fileinfo.originalName+"\"/><div>" +
					"<span style=\"height:24px; width:70px;z-index:100;color:#FFFFFF;cursor:pointer;\" onclick=\"fileope.saveAs(this,1);\">另存为</span></div>";
				return divstr;*/

                var divstr = "<div class='chatpl'>" +
                        "<div class='upload-fileico'></div>" +
                        "<div class='upload-fileinfo'>" +
                            "<span class='filename'>"+fileinfo.originalName+"</span>" +
                            "<div class=\"wrapper\"><div class=\"load-bar\"><div id=\""+fileinfo.name+"\" class=\"load-bar-inner\" style=\"width:0%\"></div><span id='counter'>0%</span></div></div>"+
                            "<div class='fileaction'>" +
                                "<input recordid=\""+JSON.parse(recordinfo).id+"\" filename=\"filename\" originalName=\""+fileinfo.originalName+"\" type=\"file\" style=\"top:70px;width:45px;overflow: hidden;display:none;\" class=\"file\" onchange=\"fileope.download(this,this.nwsaveas)\" nwsaveas=\""+fileinfo.originalName+"\"/><div>" +
                                "<span style=\"height:24px; width:70px;z-index:100;color:#000000;cursor:pointer;\" onclick=\"fileope.saveAs(this,1);\">另存为</span></div>"+
                            "</div>"+
                        "</div>" +
                    "</div>";
                return divstr;
			}
			else
			{
				return message;
			}
		},
		createDbfile:function(userid){
			var path = require("path");
			var record_path=path.dirname(process.execPath);
			record_path=record_path+"/record"
			this.createPath(record_path);
			if(!fs.existsSync(record_path+"/"+userid))
			{
				writeFile(record_path+"/"+userid,"");
			}
		},
		groupFiledownload:function(fileid,input,originalName)
		{
			var progress=input.parentNode.parentNode.childNodes[3];
			var url = require('url');
			var http = require('http');
			var file_url=userInfo.configinfo.server_url+"/uploads/"+fileid;
			progress.style.display="block";
			input.parentNode.parentNode.childNodes[4].style.display="none";
			input.parentNode.parentNode.childNodes[5].style.display="none";

			var options = {
				host: url.parse(file_url).host.split(":")[0],
				port: url.parse(file_url).port,
				path: url.parse(file_url).pathname
			};
			var path = input.value;
			var originalNameArr = originalName.split('.');
			if(originalNameArr.length > 1) {
				var originalExtensionName = originalNameArr[originalNameArr.length - 1];
				var NewNameArr = path.split('.');
				var NewExtensionName = NewNameArr[NewNameArr.length - 1];
				if (NewExtensionName != originalExtensionName) {
					path = path + '.' + originalExtensionName;
				}
			}
			var file_name = url.parse(file_url).pathname.split('/').pop();
			var file = fs.createWriteStream(path);
			var request=http.get(file_url, function(res) {
				var fsize = res.headers['content-length'];
				res.on('data', function(data) {
						file.write(data);
						var value2=100-(((fsize-file.bytesWritten)/fsize)*100);
						value2=Math.ceil(value2);
						progress.childNodes[0].style.width=value2+"%";
					}).on('end', function() {
						progress.childNodes[0].style.width="100%";
						progress.style.display="none";
						input.parentNode.parentNode.childNodes[4].style.display="block";
						input.parentNode.parentNode.childNodes[4].childNodes[0].setAttribute("filename",path);
						input.parentNode.parentNode.childNodes[4].childNodes[1].setAttribute("filename",path);
						file.end();
					});
				});
				request.on('error', function(e) { 
					progress.style.display="none";
					input.parentNode.parentNode.childNodes[5].style.display="block";
				});
		},
		setMainWindow:function(mainWindow2,projectId2){
			mainWindow=mainWindow2;
			projectId=projectId2;
			// remark.setProject(projectId2);
			var level=""+mainWindow.window.project_level;
			project_level2=level;
			if(level!=="1"&&level!=="2"&&level!=="3")
			{
				// document.getElementById("remark__chat").style.display="none";
				// document.getElementById("record__All").style.display="none";
				//document.getElementById("record__All").parentNode.childNodes[5].style.marginLeft="211px";
				// document.getElementById("groupinfolayer_history").style.paddingLeft="75px";//padding-left: 75px;
			}
		},
		getProjectLevel:function(){
			return project_level2;
		},
		writeGroupFile:function(groupid){///api/file/group/:groupId
			//console.debug("群文件");
			$.ajax(userInfo.configinfo.server_url+"/api/file/group/"+groupid, {
				type: 'get',
				success: function(result){
					//console.debug(result);
					var filelist=document.getElementById("file_list");
					if(result.length!==0)
					{
						var ul=document.createElement("ul");
						ul.setAttribute("class","chatSiteBar");
						filelist.appendChild(ul);
						for(var i=0;i<result.length;i++)
						{
							var li=document.createElement("li");
							ul.appendChild(li);
							var div=document.createElement("div");
							div.setAttribute("id",result[i]._id);
							div.setAttribute("class","chatListGroup chat_item file-box");
							var divstr="<div class=\"icon-file\"><img src=\"images/ico-file_purple.png\" alt=\"ico-file.png\"><input title=\"下载\" filename=\"filename\" originalName=\""+result[i].originalName+"\" type=\"file\" style=\"top:13px;left:0px;width:20px;\" class=\"file\" onchange=\"fileope.groupFiledownload('"+result[i].name+"',this,this.nwsaveas)\" nwsaveas=\""+result[i].originalName+"\"/></div>";
							divstr=divstr+"<div class=\"info\" title=\""+result[i].originalName+"\"><span class=\"nickname_text name-size\">"+result[i].originalName+"</span></div>";
							div.innerHTML=divstr;
							var deldiv=document.createElement("div");
							deldiv.setAttribute("class","extdel");
							deldiv.innerHTML="<img src=\"images/del.png\" alt=\"del.png\"/>";
							deldiv.onclick=function(){
								var _this=this;
								var fileId=this.parentNode.id;
								$.ajax(userInfo.configinfo.server_url+"/api/file/"+fileId, {
									type: 'delete',
									success: function(result){
										_this.parentNode.parentNode.removeChild(_this.parentNode);
									},
									error: function(err){
										////console.debug("读取失败");
									}
								});
							};
							div.appendChild(deldiv);
							var pro_div=document.createElement("div");
							pro_div.style.cssText="position: absolute;top: 40px;left: 0px;width: 100%;height: 10px;display:none;";
							pro_div.innerHTML="<div style=\"width:0%;height:100%;background-color:#389f00;\"></div>";
							div.appendChild(pro_div);
							var opendiv=document.createElement("div");
							opendiv.style.cssText="position: absolute;top: 17px;height: 35px;width: 50%;left: 55px;font-size: 12px;text-align: left;padding-left: 1px;color:#000000;display:none;";
							opendiv.innerHTML="<span onclick=\"fileope.openFile(this)\">打开</span><span style=\"margin-left:20px;\" onclick=\"fileope.openPath(this)\">打开目录</span>";
							div.appendChild(opendiv);
							var errordiv=document.createElement("div");
							errordiv.style.cssText="position: absolute;top: 17px;height: 35px;width: 50%;left: 55px;font-size: 12px;text-align: left;padding-left: 1px;color:#FF0000;display:none;";
							errordiv.innerHTML="失败，网络断开或文件不存在";
							div.appendChild(errordiv);
							li.appendChild(div);
							div.onmouseover=function(){
								for(var i=0;i<ul.childNodes.length;i++)
								{
									var li2=ul.childNodes[i];
									if(li2.getAttribute("class")!=="blank")
									{
										try
										{
											li2.childNodes[0].childNodes[2].style.display="none";
										}
										catch (e)
										{}
										
									}
								}
								if (userInfo.level < 2)
								{
									this.childNodes[2].style.display="block";
								}
							};
						}
					}
				},
				error: function(err){
					//console.debug("读取失败");
				}
			});
		},
		displayFa:function(versionId,name,version,OpenManType){
			var gui = require('nw.gui');
			var oneSchemeWindow= gui.Window.open('pageContainer.html', {
				title:"方案",
				position: 'center',
				width: 842,
				height: 942,
				toolbar: false,
				resizable: false,
				frame: false
			});

			oneSchemeWindow.on('loaded', function(){
				this.window.setUrl('taskSchemeEdit.html?versionId='+versionId+
					'&name='+name+'&version='+version + '&OpenManType=0');
			});
		},
		getUserDiv:function(id){
			return document.getElementById(id);
		},
		checkWin:function(person,group,senderid,receiverid){
			if(person){
				if(person.window.fileope.getUserDiv(senderid)||person.window.fileope.getUserDiv(receiverid)){
					return false;
				}
			}
			if(group){
				if(group.window.fileope.getUserDiv(senderid)||group.window.fileope.getUserDiv(receiverid)){
					return false;
				}
			}
			return true;
		}
	}
}()