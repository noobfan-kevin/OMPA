/**
 * Created by doublechang on 2015/11/17.
 */
var File=process.core.db.models.File;//.core.db.models.File;
var utils = process.core.utils;
var async = require('async');

var fileService = module.exports;

fileService.create = function (file) {
    return File.create(file);
};

fileService.bulkCreate = function (files) {
    return File.bulkCreate(files);
};

fileService.getById = function (id) {
   return File.findById(id);
};
fileService.getByName = function (name) {
    return File.findOne({
        where: {name: name}
    });
};
fileService.arrangeFolderTree=function(folders){
   // console.log(folders);
    var promises = folders.map(function (folder) {
        //console.log("===========121212211==============");
        //console.log(folder);
        return fileService.getByFatherId(folder.id).then(function(files){
            folder.child=files;
            return folder;
        });
    });
    return Promise.all(promises);
};
fileService.getByFatherId=function (fatherId,order) {
    if (!order) {
        //order: [["createdAt", "DESC"]]
        order="DESC";
    }
    return File.all({
        where:{parentId:fatherId},
        order: [["createdAt", order]]
    });
};

fileService.getByOriginalName = function (name) {
    return File.one({
        where:{originalName: name}
    });
};

fileService.getByOriginalNameAndFatherId = function (fatherId,name) {
    return File.findOne({
        where:{parentId: fatherId,originalName: name}
    });
};

fileService.queryBySourceKey = function (id) {
    return File.all({
        where:{sourceKey:id}
    });
};

fileService.findGroupFile = function (id) {
    return File.all({
        where:{sourceKey:id},
        order: [["createdAt", "DESC"]]
    });
};

fileService.updateById = function (id, file) {

    return File.findOne({
        where: {id: id}
    }).then(function(dbfile){
        return dbfile.update(file);
    });

};

fileService.delFileInList = function(args){
    return File.destroy({
        where:{
            id:{
                $in:args
            }
        }
    });
};

fileService.deleteById = function (id) {
    return fileService.getById(id).then(function (dbfile) {
        return dbfile.destroy();
    });
};
fileService.deleteByIndex = function (index) {
    return File.destroy({
        where:{
            index: {
                $iLike:  index + '%'
            }
        }
    });
    /*return fileService.getById(id).then(function (dbfile) {
        return dbfile.destroy();
    });*/
};
fileService.queryFolderSon= function (fatherid,isall) {
    //where:{parentId: fatherId,originalName: name}
    if(!isall)
    {
        return File.all({
            where: {
                parentId: fatherid,
                isFolder:true
            }
        });
    }
    else{
        return File.all({
            where: {
                parentId: fatherid
            }
        });
    }
};
fileService.queryFoldersByFather = function (father) {
    if (!father.isFolder) {
        return [];
    }
    return File.all({
        where: {
            index: {
                $iLike:  father.index + '%'
            },
            isFolder:true
        }
    });
};


// 删除文件
fileService.delete = function (query) {
    return File.destroy(query)
};
