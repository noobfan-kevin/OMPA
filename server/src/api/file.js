/**
 * Created by YanJixian on 2015/7/21.
 */

var express = require('express');
var router = module.exports = express.Router();
var log = process.core.log;
var fileService = require('../service/fileService');
var projectService = require('../service/projectService');
var assetInfoService = require('../service/assetInfoService');
var sceneService = require('../service/sceneService');
var reviewCommentService = require('../service/reviewComment');
var contentDisposition = require('content-disposition');
var config=require('../config.js');//config
var path = require('path');
var utils = require('../core/utils');
var async = require('async');
var userLog = require('../core/userLog');
/**
 * @api {post} /api/file/upload 上传接口
 * @apiName UploadFile
 * @apiGroup File
 * @apiPermission all
 *
 * @apiParam {File}  file 需要上传的文件
 * @apiParam {Number}  sourceType 来源类型
 * @apiParam {String}  sourceKey 来源主键编号
 *
 * @apiSuccess {String} originalName 上传文件原文件名
 * @apiSuccess {String} filename 上传后的文件名
 * @apiSuccess {String} path 上传后的文件相对路径
 * @apiSuccess {String} ext 文件后缀名
 * @apiSuccess {String} size 文件大小 
 * @apiSuccess {String} sourceKey 来源主键编号
 * @apiSuccess {Number} sourceType 来源类型
 * @apiSuccess {String} authorId 上传作者
 * @apiSuccess {Date} time 上传时间
 *
 */
router.post('/upload',function(req, res, next){
	var avatar = req.files['avatar'] ? req.files['avatar'][0]: null
		, projectThumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0]: null
		, file = req.files['file'] ?  req.files['file'][0]: null;

	var  file =  avatar || projectThumbnail || file;

	if(file) {
		var user = req.session.user;

		file.sourceTable = req.body.sourceTable;
		file.sourceKey = req.body.sourceKey;
		file.parentId = req.body.fatherId;
		if(user){    // session停用
			file.authorId = user.id;
		}
		var name=file.originalname;
		file.originalName=name;
		file.name= file.fieldname + '/' + file.filename;
		file.logicPath = '/' + file.fieldname;

		if(req.body.fatherId){
			
			fileService.getById(file.parentId).then(function(fileinfo){
				var index=null;
				if(fileinfo!==null)
				{
					index=fileinfo.dataValues.index;
				}
				file.index=index;
				fileService.getByOriginalNameAndFatherId(file.parentId,name).then(function(dbfile_2){
					if(dbfile_2!==null)
					{
						file.originalname=name+"("+new Date().getTime()+")";
					}
					fileService.create(file).then(function (dbFile) {
						res.json(dbFile);
					})
				});
			}).catch(function(error){
				next(error);
			});
			
		}else{
			if(req.body.groupid)
			{
				file.sourceKey = req.body.groupid;
				file.creatorId = req.body.creatorId;
			}
			fileService.create(file).then(function (dbFile) {

				// 更新项目缩略图
				if(req.body.projectId){
					projectService.updateById(req.body.projectId,{"projectImg":dbFile.name}).then(function() {
						res.json(dbFile);
					})
				}else if(req.body.assetId){
					//日志
					new Promise(function(resolve,reject){
						assetInfoService.findAssetById(req.body.assetId).then(function(data){
							//TODO name,type,desc
							var changeInfo = '资产修改：';
							if(data.assetImg!=dbFile.name){
								changeInfo+='资产：'+data.name+'，修改缩略图\r\n';
							}
							var _data = {};
							_data.info = changeInfo;
							_data.id = data.projectId;
							resolve(_data);
						});
					}).then(function(info){
						assetInfoService.updateById(req.body.assetId,{"assetImg":dbFile.name}).then(function() {
							if(info.info!='资产修改：'){
								userLog.log({type:0,typeId:'',projectId:info.id,description:info.info});
							}
							res.json(dbFile);
						})
					}).catch(function(errinfo){
						console.log(errinfo);
					});

				}else if(req.body.shotId){
					new Promise(function(resolve,reject){
						sceneService.getShotById(req.body.shotId).then(function(data){
							//TODO name,type,desc
							var changeInfo = '镜头修改：';
							if(data.assetImg!=dbFile.name){
								changeInfo+='镜头：'+data.name+'，修改缩略图\r\n';
							}
							var _data = {};
							_data.info = changeInfo;
							_data.projectId = data.projectId;
							resolve(_data);
						});
					}).then(function(info){
						sceneService.updateById(req.body.shotId,{"assetImg":dbFile.name}).then(function() {
							if(info.info!='镜头修改：'){
								userLog.log({type:0,typeId:'',projectId:info.projectId,description:info.info});
							}
							res.json(dbFile);
						})
					}).catch(function(errinfo){
						console.log(errinfo);
					});

				}else if(req.body.reviewId){
					console.log(dbFile,'fififififififi',req.body.reviewId);
					reviewCommentService.updateById(req.body.reviewId,{"fileId":dbFile.id}).then(function() {
						res.json(dbFile);
					})
				}
				else{
					res.json(dbFile);
				}


			}).catch(function(err){
				next(err);
			})
		}
	} else {
		var err = new Error("file must not be null!");
		err.status = 500;
		next(err);
	}
});

/**
 * @api {get} /api/file/download/:name 下载文件接口
 * @apiName downloadFile
 * @apiGroup File
 * @apiPermission all
 *
 * @apiParam (params) {String}  name 下载的文件名
 *
 * @apiSuccess {File} file 下载的文件
 *
 */
router.get('/download/:name', function(req, res, next){

    var name = req.params.name;
	fileService.getByName(name).then(function (dbFile) {
		var data = require('fs').readFileSync(dbFile.path);
		res.setHeader('Content-Disposition', contentDisposition(dbFile.originalName));
		res.setHeader('Content-Length', data.length/1000);
		res.send(data);
	}).catch(function(err){
		next(err);
	});
    /*fileService.get({name:name}, function (err, dbFile) {
        if (err) {
            next(err);
        } else {
            var data = require('fs').readFileSync(dbFile.path);
            res.setHeader('Content-Disposition', contentDisposition(dbFile.originalName));
            res.setHeader('Content-Length', data.length/1000);
            res.send(data);
        }
    });*/

});

/**
 * @api {get} /api/file 获取文件列表
 * @apiName GetFileList
 * @apiGroup File
 * @apiPermission all
 *
 * @apiParam {Object} [conditions={}] 查询条件
 * @apiParam {String} [fields=""] 查询字段
 * @apiParam {Object} [options={}] 查询选项，分页、排序
 *
 * @apiParamExample {json} 请求用户aa上传的文件:
 *  {
 *      conditions: {authorId：'aa'}
 *  }
 *
 * @apiSuccess {Array} list 文件数组
 *
 */
router.get('/', function (req, res, next) {

    fileService.query(req.query).then(function (list) {
		res.result = {ok: true, desc: '查询列表'};
		res.json({ok: true, list:list});
	}).catch(function(err){
		next(err);
	});
});

/**
 * @api {get} /api/file/:fileId 查询文件信息
 * @apiName GetFile
 * @apiGroup File
 * @apiPermission all
 *
 * @apiParam {String} fileId 文件Id
 *
 * @apiSuccess {String} originalName 上传文件原文件名
 * @apiSuccess {String} filename 上传后的文件名
 * @apiSuccess {String} path 上传后的文件相对路径
 * @apiSuccess {String} ext 文件后缀名
 * @apiSuccess {String} size 文件大小
 * @apiSuccess {String} sourceKey 来源主键编号
 * @apiSuccess {Number} sourceType 来源类型
 * @apiSuccess {String} authorId 上传作者
 * @apiSuccess {Date} time 上传时间
 *
 */
router.get('/:fileId',function (req, res, next) {
    var fileId = req.params.fileId;
    fileService.getById(fileId).then(function (dbFile) {
		////console.log(dbFile);
		res.json(dbFile);
	}).catch(function(err){
		next(err);
	});
	/*
	 fileService.getById(fileId, function (err, dbFile) {
	 if (err) {
	 next(err);
	 } else {
	 res.json(dbFile);
	 }
	 });
	*/
});

/**
 * @api {delete} /api/file/:fileId 删除文件
 * @apiName DeleteFile
 * @apiGroup File
 * @apiPermission all
 *
 * @apiParam {String} fileId 文件Id
 *
 * @apiSuccess {Boolean} ok 删除操作是否成功
 *
 */
router.delete('/:fileId', function (req, res, next) {
    var fileId = req.params.fileId;
	fileService.getById(fileId).then(function(dbfile){
		//if()
		if(dbfile)
		{
			if(!dbfile.dataValues.isFolder)
			{
				fileService.deleteById(fileId).then(function(info){
					res.json({ok: true});
				});
			}
			else
			{
				fileService.deleteByIndex(dbfile.dataValues.index).then(function(info){
					res.json({ok: true});
				});
			}
		}
	}).catch(function(error){
		next(error);
	});
});

router.post('/deleteFilesInList/:list', function (req, res, next) {
	var list = req.params.list;
	fileService.delFileInList(list.split(",")).then(function(dbfile){
		res.json({ok: true});
	}).catch(function(error){
		next(error);
	});
});
/**
 * @api {delete} /api/file/deleteBySourceKey/:sourceKey 删除文件
 * @apiName DeleteFile
 * @apiGroup File
 * @apiPermission all
 *
 * @apiParam {String} sourceKey sourceKey
 *
 * @apiSuccess {Boolean} ok 删除操作是否成功
 *
 */
router.delete('/deleteBySourceKey/:sourceKey', function (req, res, next) {
	var sourceKey = req.params.sourceKey;

	fileService.delete({
		where: {
			sourceKey: sourceKey
		}
	}).then(function (num) {
		if (num) {
			res.json({ ok: true, message: '删除文件' })
		} else {
			res.json({ ok: false, message: '没有找到要删除的文件' })
		}
	}).catch(function (error) {
		next(error);
	});
});

/**
 * @api {post} /api/file/uploadCuteImage 截图上传接口
 * @apiName uploadCuteImage
 * @apiGroup File
 * @apiPermission all
 *
 * @apiParam {String}  imagesrc 截图字符串
 * @apiParam {String}  filename 文件名称

 *
 * @apiSuccess {String} originalName 上传文件原文件名
 * @apiSuccess {String} filename 上传后的文件名
 * @apiSuccess {String} path 上传后的文件相对路径
 * @apiSuccess {String} ext 文件后缀名
 * @apiSuccess {String} size 文件大小
 * @apiSuccess {String} sourceKey 来源主键编号
 * @apiSuccess {Number} sourceType 来源类型
 * @apiSuccess {String} authorId 上传作者
 * @apiSuccess {Date} time 上传时间
 *
 */
router.post('/uploadCuteImage',function(req, res, next){
    var filesrc = req.body.imagesrc;
	var filename = req.body.filename;
	var path2= config.uploadPath;//config.uploadPath;
	var fs = require('fs');
	var base64Data = filesrc.replace(/^data:image\/\w+;base64,/,"");
	base64Data = base64Data.replace(/\s/g,"+");
	var dataBuffer = new Buffer(base64Data, 'base64');
	fs.writeFile(path2+"/"+filename+".png", dataBuffer, function(err) {
		if(err){
			next(err);
		}else{
			////console.debug("保存成功");
			var dbFile={
				originalName:filename+".png",
				name:filename+".png",
				path:path2+"/"+filename+".png"
			};
			fileService.create(dbFile).then(function(dbfile2){
				res.json({ok: true, info:dbfile2});
			}).catch(function(error){
				next(error);
			});
		}
	});
});

/**
 * @api {get} /api/file/father/:fatherId 查询文件信息
 * @apiName GetFile
 * @apiGroup File
 * @apiPermission all
 *
 * @apiParam {String} fatherId 文件Id
 *
 * @apiSuccess {String} originalName 上传文件原文件名
 * @apiSuccess {String} filename 上传后的文件名
 * @apiSuccess {String} path 上传后的文件相对路径
 * @apiSuccess {String} ext 文件后缀名
 * @apiSuccess {String} size 文件大小
 * @apiSuccess {String} sourceKey 来源主键编号
 * @apiSuccess {Number} sourceType 来源类型
 * @apiSuccess {String} authorId 上传作者
 * @apiSuccess {Date} time 上传时间
 *
 */
router.get('/father/:fatherId',function (req, res, next) {
    var fatherId = req.params.fatherId;
	var order=req.query.order;
	console.log("==========349========="+fatherId);
	fileService.getByFatherId(fatherId,order).then(function(files){
		res.json(files);
	}).catch(function(error){
		next(error);
	});
    /*fileService.getByFatherId(fatherId, function (err, dbFile) {
        if (err) {
            next(err);
        } else {
			//console.log(dbFile);
            res.json(dbFile);
        }
    });*/
});

router.post('/getFileChild/',function (req, res, next) {
	//console.log("========365===========");
	//console.log(req.body);
	var fatherId = req.body.node;
	if(fatherId.indexOf("folderId_")>=0)
	{
		fatherId=fatherId.replace("folderId_","");
	}

	var order="ASC";
	fileService.getByFatherId(fatherId,order).then(function(files) {
		var result = [];
		for (var i = 0; i < files.length; i++) {
			if(files[i].dataValues.isFolder){
				result.push(files[i].dataValues);
			}
		}
		//console.log(result);
		fileService.arrangeFolderTree(result).then(function(result2){
			//console.log(result2);
			//res.json(files);
			var filearray=[];
			for(var i=0;i<result2.length;i++){
				//{"text":"air","id":"\/air","cls":"folder","leaf":false}
				/*
				 treeNode.put("allowAppend", true);
				 treeNode.put("leaf", true);
				 treeNode.put("allowDelete", true);
				 treeNode.put("allowModify", true);
				* */
				//console.log(result2[i].child);
				//"folderId_"+ folderId
				var node={
					id:"folderId_"+result2[i].id,
					text:result2[i].originalName
				};
				//console.log(result2[i].child);
				if(!checkFile(result2[i].child))//result2[i].child.length>0)
				{
					node.leaf=true;
				}
				else{
					node.leaf=false;
				}
				filearray.push(node);
			}
			//console.log(filearray)
			res.json(filearray);
		});
	}).catch(function(error){
		console.log(error);
		next(error);
	});
	function checkFile(files){
		var flag=false;
		for(var i=0;i<files.length;i++)
		{
			if(files[i].dataValues.isFolder)
			{
				flag=true;
			}
		}
		return flag;
	}
	/*fileService.getByFatherId(fatherId, function (err, dbFile) {
	 if (err) {
	 next(err);
	 } else {
	 //console.log(dbFile);
	 res.json(dbFile);
	 }
	 });*/
});
/**
 * @api {get} /api/file/folderAll/:fatherId 查询文件信息
 * @apiName GetFile
 * @apiGroup File
 * @apiPermission all
 *
 * @apiParam {String} fatherId 文件Id
 *
 * @apiSuccess {String} originalName 上传文件原文件名
 * @apiSuccess {String} filename 上传后的文件名
 * @apiSuccess {String} path 上传后的文件相对路径
 * @apiSuccess {String} ext 文件后缀名
 * @apiSuccess {String} size 文件大小
 * @apiSuccess {String} sourceKey 来源主键编号
 * @apiSuccess {Number} sourceType 来源类型
 * @apiSuccess {String} authorId 上传作者
 * @apiSuccess {Date} time 上传时间
 *
 */
router.get('/folderAll/:fatherId',function (req, res, next) {
    var fatherId = req.params.fatherId;
	var father={
		_id:fatherId,
		isFolder:true
	};
    fileService.queryFoldersByFather(father, function (err, dbFile) {
        if (err) {
            next(err);
        } else {
			//console.log(dbFile);
            res.json(dbFile);
        }
    });

});

/**
 * @api {get} /api/file/group/:groupId 查询群文件
 * @apiName GetGroupFile
 * @apiGroup File
 * @apiPermission all
 *
 * @apiParam {String} fatherId 文件Id
 *
 * @apiSuccess {String} originalName 上传文件原文件名
 * @apiSuccess {String} filename 上传后的文件名
 * @apiSuccess {String} path 上传后的文件相对路径
 * @apiSuccess {String} ext 文件后缀名
 * @apiSuccess {String} size 文件大小
 * @apiSuccess {String} sourceKey 来源主键编号
 * @apiSuccess {Number} sourceType 来源类型
 * @apiSuccess {String} authorId 上传作者
 * @apiSuccess {Date} time 上传时间
 *
 */
router.get('/group/:groupId',function (req, res, next) {
    var groupId = req.params.groupId;
    fileService.findGroupFile(groupId).then(function (dbFile) {

            res.json(dbFile);

    }).catch(err =>  next(err));
});

/**
 * @api {post} /api/file/newFolder 添加目录
 * @apiName newFolder
 * @apiGroup File
 * @apiPermission all
 *
 * @apiParam {String}  name 文件夹名称

 *
 * @apiSuccess {String} originalName 上传文件原文件名
 * @apiSuccess {String} filename 上传后的文件名
 * @apiSuccess {String} path 上传后的文件相对路径
 * @apiSuccess {String} ext 文件后缀名
 * @apiSuccess {String} size 文件大小
 * @apiSuccess {String} sourceKey 来源主键编号
 * @apiSuccess {Number} sourceType 来源类型
 * @apiSuccess {String} authorId 上传作者
 * @apiSuccess {Date} time 上传时间
 *
 */
router.post('/newFolder',function (req, res, next) {
    var folderName = req.body.name;
	var fatherId=req.body.fatherId;
	fileService.getById(fatherId).then(function(dbfile){
		if(dbfile===null)
		{
			var parentArray=[];
			parentArray.push(fatherId);
			fileService.queryFolderSon(fatherId).then(function(files){
				var index=files.length;
				var dbFile={
					parentId:fatherId,
					isFolder:true,
					parentIds:JSON.stringify(parentArray),
					originalName:folderName,
					index:(index+1)+","
				};
				fileService.create(dbFile).then(function(fl){
					res.json({ok: true, info:fl.dataValues});
				});
			});
		}
		else
		{
			////console.log(dbfile.dataValues);
			var parentIds=JSON.parse(dbfile.dataValues.parentIds);
			parentIds.push(dbfile.id);
			var index=dbfile.dataValues.index;
			fileService.queryFolderSon(fatherId).then(function(files){
				////console.log(files)
				var count=files.length+1;
				index=index+count+","
				var dbFile={
					parentId:fatherId,
					isFolder:true,
					parentIds:JSON.stringify(parentIds),
					originalName:folderName,
					index:index
				};
				fileService.create(dbFile).then(function(fl){
					res.json({ok: true, info:fl.dataValues});
				});
			});
		}
	}).catch(function(err){
		next(err);
	});
	/*fileService.getById(fatherId, function (err, dbFile) {
        if (err) {
            //next(err);
			var parentArray=[];
			parentArray.push(fatherId);
			var dbFile={
				fatherId:fatherId,
				isFolder:true,
				parent:JSON.stringify(parentArray),
				originalName:folderName
			};
			fileService.create(dbFile, function (err, dbFile2) {
				if(err) {
					return next(err);
				}
				res.json({ok: true, info:dbFile2});
			});
        } else {
            //res.json(dbFile);
			//console.log(dbFile);
			var parentArray=[];
			if(dbFile!==null)
			{
				parentArray=JSON.parse(dbFile.parent);
			}
			parentArray.push(fatherId);
			var dbFile={
				fatherId:fatherId,
				isFolder:true,
				parent:JSON.stringify(parentArray),
				originalName:folderName
			};
			fileService.create(dbFile, function (err, dbFile2) {
				if(err) {
					return next(err);
				}
				res.json({ok: true, info:dbFile2});
			});
        }
    });*/
});

/**
 * @api {post} /api/file/updateName 截图上传接口
 * @apiName updateName
 * @apiGroup File
 * @apiPermission all
 *
 * @apiParam {String}  name 文件夹或文件名称

 *
 * @apiSuccess {Boolean} ok 修改操作是否成功
 *
 */

router.post('/updateName',function (req, res, next) {
    var folderName = req.body.name;
	var fileId = req.body.fileId;
	////console.log("617:"+fileId)
	var name="";
	fileService.getById(fileId).then(function(dbFile){
		name=dbFile.dataValues.originalName
		fileService.queryFolderSon(dbFile.dataValues.parentId).then(function(files){
			////console.log(files);
			var flag=true;
			for(var i=0;i<files.length;i++) {
				if(fileId!==files[i].dataValues.id&&files[i].dataValues.originalName===folderName)
				{
					flag=false;
					break;
				}
			}
			//res.json({ok: true});
			if(flag)
			{
				var dbFile={
					originalName:folderName
				};
				fileService.updateById(fileId,dbFile).then(function(file1){
					res.json({ok: true});
				});
			}
			else
			{
				res.json({ok: false,info:"该文件或目录已经存在！",name:name});
			}
		});
	}).catch(function(error){
		next(error)
	});
});

/**
 * @api {post} /api/file/cutFile 截图上传接口
 * @apiName cutFile
 * @apiGroup File
 * @apiPermission all
 *
 * @apiParam {String}  name 文件夹或文件名称

 *
 * @apiSuccess {Boolean} ok 修改操作是否成功
 *
 */
router.post('/cutFile',function (req, res, next) {
	var fatherid = req.body.fatherid;
	var fileid = req.body.fileid;
	if(fileid===fatherid)
	{
		res.json({ok: false, info:"目标文件夹与源文件夹不能相同"});
	}
	else
	{
		fileService.getById(fileid).then(function(dbfile){
			//console.log(dbfile);
			if(dbfile.dataValues.parentId===fatherid)
			{
				console.log("不要再当前文件夹上进行剪切操作");
				res.json({ok: false, info:"不要再当前文件夹上进行剪切操作"});
			}
			else{
				if(dbfile.dataValues.isFolder) {
					fileService.getById(fatherid).then(function(folder){
						var flag=true;
						console.log("=========677==========");
						var parentArray=[];
						if(folder!==null)
						{
							parentArray=JSON.parse(folder.dataValues.parentIds);
						}
						console.log("======683========");
						for(var i=0;i<parentArray.length;i++)
						{
							if(fileid===parentArray[i])
							{
								flag=false;
								break;
							}
						}
						if(!flag)
						{
							res.json({ok: false, info:"目标文件夹是源文件夹的子文件夹"});
						}
						else
						{
							fileService.queryFolderSon(fatherid).then(function(files){
								var count=files.length+1;
								var index="";//folder.dataValues.index;
								if(folder!==null)
								{
									index=folder.dataValues.index;
								}
								index=index+count+",";
								var parents=[];
								if(folder!==null)//fatherid
								{
									parents=JSON.parse(folder.dataValues.parentIds);
								}
								parents.push(fatherid);
								var name=dbfile.dataValues.originalName;
								if(!checkrepeat(files,dbfile.dataValues.originalName))
								{
									name=getFolderNewName(files,name);
								}
								var dbFile2={
									originalName:name,
									name:dbfile.dataValues.name,
									path:dbfile.dataValues.path,
									parentId:fatherid,
									parentIds:JSON.stringify(parents),
									isFolder:true,
									index:index
								};
								fileService.create(dbFile2).then(function(fl){
									sonFolder(dbfile.dataValues.id,fl);//fl.dataValues.id);
									fileService.getByFatherId(fileid).then(function(fileArray){
										var isleaf=true;
										for(var i=0;i<fileArray.length;i++)
										{
											if(fileArray[i].dataValues.isFolder)
											{
												isleaf=false;
											}
										}
										fl.dataValues.isleaf=isleaf;
										fileService.deleteById(fileid);
										res.json({ok: true, info:fl});
									});
								});
							});
						}
					});
				}
				else{
					fileService.getById(fatherid).then(function(folder){
						fileService.queryFolderSon(fatherid,true).then(function(files){
							//console.log(files);
							var index=null;//folder.dataValues.index;
							var parents=[];//JSON.parse(folder.dataValues.parentIds);
							if(folder!==null)
							{
								parents=JSON.parse(folder.dataValues.parentIds);
								index=folder.dataValues.index;
							}
							parents.push(fatherid);
							var name=dbfile.dataValues.originalName;
							if(!checkrepeat(files,dbfile.dataValues.originalName))
							{
								name=getFileNewName(files,name);//name+"("+(new Date().getTime())+")";
							}
							//console.log(name);
							var dbFile2={
								originalName:name,
								name:dbfile.dataValues.name,
								path:dbfile.dataValues.path,
								parentId:fatherid,
								parentIds:JSON.stringify(parents),
								isFolder:false,
								size:dbfile.dataValues.size,
								index:index
							};
							fileService.create(dbFile2).then(function(fl){
								fileService.deleteById(fileid);
								fileService.getByFatherId(fileid);
								res.json({ok: true, info:fl});
							});
						});
					})
				}
			}

		}).catch(function(error){
			next(error);
		});
	}
	function getFileNewName(files,name)
	{
		var filename="";
		for(var i=0;i<files.length;i++)
		{
			//if(files[i].dataValues.name===)
			if(name===files[i].dataValues.originalName)
			{
				filename=files[i].dataValues.name;
				break;
			}
		}
		var ext="";
		if(filename.indexOf(".")>=0)
		{
			ext="."+filename.split(".")[1]
		}
		if(ext!=="") {
			var name=getFolderNewName(files,name.replace(ext,""),ext)+ext;
			return name;
		}
		else{
			var name=getFolderNewName(files,name);
			return name;
		}
	}
	function getFolderNewName(files,name,ext){
		var count=-100000;
		var result=name;
		for(var i=0;i<files.length;i++)
		{
			//var reg= new RegExp("^"+name+"[(]{1}[\\d]+[)]{1}$");
			var name_2=files[i].dataValues.originalName.replace(ext,"");
			if(name_2.indexOf(name)===0){
				name_2=name_2.replace(name,"");
				if(name_2.indexOf("(")>=0&&name_2.indexOf(")")>=0)
				{
					name_2=name_2.substring(name_2.indexOf("(")+1,name_2.indexOf(")"));
					if(!isNaN(name_2)&&parseInt(name_2)>count)
					{
						count=parseInt(name_2);
					}
				}
			}
			/*if(reg.test(name_2))
			 {
			 var name2=files[i].dataValues.originalName;
			 name2=name2.substring(name2.indexOf("(")+1,name2.indexOf(")"));
			 if(parseInt(name2)>count)
			 {
			 count=parseInt(name2);
			 }
			 }*/
		}
		if(count>0)
		{
			count=count+1;
			result=name+"("+count+")";
		}
		else{
			result=name+"(1)";
		}
		return result;
	}
	function checkrepeat(files,name){
		var flag=true;
		//console.log(files);
		for(var i=0;i<files.length;i++)
		{
			if(files[i].dataValues.originalName===name)
			{
				flag=false;
				break;
			}
		}
		return flag;
	}
	function sonFolder(sourceid,targetfolder){
		fileService.getByFatherId(sourceid).then(function(files){
			////console.log(files);
			for(var i=0;i<files.length;i++) {
				var index=targetfolder.dataValues.index;
				index=index+(i+1)+",";
				var parents=JSON.parse(targetfolder.dataValues.parentIds);
				parents.push(targetfolder.dataValues.id);
				var dbFile2={
					originalName:files[i].dataValues.originalName,
					name:files[i].dataValues.name,
					path:files[i].dataValues.path,
					parentId:targetfolder.dataValues.id,
					parentIds:JSON.stringify(parents),
					isFolder:files[i].dataValues.isFolder,
					size:files[i].dataValues.size,
					index:index
				};
				var fls=files[i];
				fileService.create(dbFile2).then(function(fl){
					//console.log(fls)
					////console.log(files[i].dataValues)
					sonFolder(fls.dataValues.id,fl);//fl.dataValues.id);
				}).catch(function(error){
					//console.log("734:"+error);
				});
			}
		});
	}
});

/**
 * @api {post} /api/file/copyFile 截图上传接口
 * @apiName copyFile
 * @apiGroup File
 * @apiPermission all
 *
 * @apiParam {String}  name 文件夹或文件名称

 *
 * @apiSuccess {Boolean} ok 修改操作是否成功
 *
 */
router.post('/copyFile',function (req, res, next) {
	var fatherid = req.body.fatherid;
	var fileid = req.body.fileid;
	if(fileid===fatherid)
	{
		res.json({ok: false, info:"目标文件夹与源文件夹不能相同"});
	}
	else
	{
		fileService.getById(fileid).then(function(dbfile){
			if(dbfile.dataValues.isFolder) {
				fileService.getById(fatherid).then(function(folder){
					var flag=true;
					//console.log("=========677==========");
					var parentArray=[];
					if(folder!==null)
					{
						parentArray=JSON.parse(folder.dataValues.parentIds);
					}
					//console.log("======683========");
					for(var i=0;i<parentArray.length;i++)
					{
						if(fileid===parentArray[i])
						{
							flag=false;
							break;
						}
					}
					if(!flag)
					{
						res.json({ok: false, info:"目标文件夹是源文件夹的子文件夹"});
					}
					else
					{
						fileService.queryFolderSon(fatherid).then(function(files){
							var count=files.length+1;
							var index="";//folder.dataValues.index;
							if(folder!==null)
							{
								index=folder.dataValues.index;
							}
							index=index+count+",";
							var parents=[];
							if(folder!==null)//fatherid
							{
								parents=JSON.parse(folder.dataValues.parentIds);
							}
							parents.push(fatherid);
							var name=dbfile.dataValues.originalName;
							if(!checkrepeat(files,dbfile.dataValues.originalName))
							{
								name=getFolderNewName(files,name);
							}
							var dbFile2={
								originalName:name,
								name:dbfile.dataValues.name,
								path:dbfile.dataValues.path,
								parentId:fatherid,
								parentIds:JSON.stringify(parents),
								isFolder:true,
								index:index
							};
							fileService.create(dbFile2).then(function(fl){
								sonFolder(dbfile.dataValues.id,fl);//fl.dataValues.id);
								fileService.getByFatherId(fileid).then(function(fileArray){
									var isleaf=true;
									for(var i=0;i<fileArray.length;i++)
									{
										if(fileArray[i].dataValues.isFolder)
										{
											isleaf=false;
										}
									}
									console.log(fileArray);
									fl.dataValues.isleaf=isleaf;
									res.json({ok: true, info:fl});
								});
							});
						});
					}
				});
			}
			else{
				fileService.getById(fatherid).then(function(folder){
					fileService.queryFolderSon(fatherid,true).then(function(files){
						//console.log(files);
						var index=null;//folder.dataValues.index;
						var parents=[];//JSON.parse(folder.dataValues.parentIds);
						if(folder!==null)
						{
							parents=JSON.parse(folder.dataValues.parentIds);
							index=folder.dataValues.index;
						}
						parents.push(fatherid);
						var name=dbfile.dataValues.originalName;
						if(!checkrepeat(files,dbfile.dataValues.originalName))
						{
							name=getFileNewName(files,name);//name+"("+(new Date().getTime())+")";
						}
						//console.log(name);
						var dbFile2={
							originalName:name,
							name:dbfile.dataValues.name,
							path:dbfile.dataValues.path,
							parentId:fatherid,
							parentIds:JSON.stringify(parents),
							isFolder:false,
							size:dbfile.dataValues.size,
							index:index
						};
						fileService.create(dbFile2).then(function(fl){
							res.json({ok: true, info:fl});
						});
					});
				})
			}
		}).catch(function(error){
			next(error);
		});
	}
	function getFileNewName(files,name)
	{
		var filename="";
		for(var i=0;i<files.length;i++)
		{
			//if(files[i].dataValues.name===)
			if(name===files[i].dataValues.originalName)
			{
				filename=files[i].dataValues.name;
				break;
			}
		}
		var ext="";
		if(filename.indexOf(".")>=0)
		{
			ext="."+filename.split(".")[1]
		}
		if(ext!=="") {
			var name=getFolderNewName(files,name.replace(ext,""),ext)+ext;
			return name;
		}
		else{
			var name=getFolderNewName(files,name);
			return name;
		}
	}
	function getFolderNewName(files,name,ext){
		var count=-100000;
		var result=name;
		for(var i=0;i<files.length;i++)
		{
			//var reg= new RegExp("^"+name+"[(]{1}[\\d]+[)]{1}$");
			var name_2=files[i].dataValues.originalName.replace(ext,"");
			if(name_2.indexOf(name)===0){
				name_2=name_2.replace(name,"");
				if(name_2.indexOf("(")>=0&&name_2.indexOf(")")>=0)
				{
					name_2=name_2.substring(name_2.indexOf("(")+1,name_2.indexOf(")"));
					if(!isNaN(name_2)&&parseInt(name_2)>count)
					{
						count=parseInt(name_2);
					}
				}
			}
			/*if(reg.test(name_2))
			{
				var name2=files[i].dataValues.originalName;
				name2=name2.substring(name2.indexOf("(")+1,name2.indexOf(")"));
				if(parseInt(name2)>count)
				{
					count=parseInt(name2);
				}
			}*/
		}
		if(count>0)
		{
			count=count+1;
			result=name+"("+count+")";
		}
		else{
			result=name+"(1)";
		}
		return result;
	}
	function checkrepeat(files,name){
		var flag=true;
		//console.log(files);
		for(var i=0;i<files.length;i++)
		{
			if(files[i].dataValues.originalName===name)
			{
				flag=false;
				break;
			}
		}
		return flag;
	}
	function sonFolder(sourceid,targetfolder){
		fileService.getByFatherId(sourceid).then(function(files){
			////console.log(files);
			for(var i=0;i<files.length;i++) {
				var index=targetfolder.dataValues.index;
				index=index+(i+1)+",";
				var parents=JSON.parse(targetfolder.dataValues.parentIds);
				parents.push(targetfolder.dataValues.id);
				var dbFile2={
					originalName:files[i].dataValues.originalName,
					name:files[i].dataValues.name,
					path:files[i].dataValues.path,
					parentId:targetfolder.dataValues.id,
					parentIds:JSON.stringify(parents),
					isFolder:files[i].dataValues.isFolder,
					size:files[i].dataValues.size,
					index:index
				};
				var fls=files[i];
				fileService.create(dbFile2).then(function(fl){
					//console.log(fls)
					////console.log(files[i].dataValues)
					sonFolder(fls.dataValues.id,fl);//fl.dataValues.id);
				}).catch(function(error){
					//console.log("734:"+error);
				});
			}
		});
	}
});


