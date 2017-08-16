/**
 * Created by HeLiang on 2016/6/13.
 */
var FundDataBase=process.core.db.models.FundDataBase;//.core.db.models.FundDataBase;
var Creator = process.core.db.models.Creator;
var async = require('async');

var fundDataBaseService = module.exports;

fundDataBaseService.create = function (file) {
    return FundDataBase.create(file);
};

fundDataBaseService.getById = function (id) {
    return FundDataBase.findOne({
        where: {id: id}
    });
};
fundDataBaseService.arrangeFolderTree=function(folders){
    // console.log(folders);
    var promises = folders.map(function (folder) {
        //console.log("===========121212211==============");
        //console.log(folder);
        return fundDataBaseService.getByFatherId(folder.id).then(function(files){
            folder.child=files;
            return folder;
        });
    });
    return Promise.all(promises);
};
fundDataBaseService.getByFatherId=function (fatherId,order) {
    if (!order) {
        order="ASC";
    }
    return FundDataBase.all({
        where:{parentId:fatherId},
        order: [["createdAt", order]]
    });
};


fundDataBaseService.updateById = function (id, file) {

    return FundDataBase.findOne({
        where: {id: id}
    }).then(function(dbfile){
        return dbfile.update(file);
    });

};

fundDataBaseService.deleteById = function (id) {
    return FundDataBase.destroy({
        where: {
            id :id
        }
    })
};

fundDataBaseService.deleteByProjectId = function () {
    return FundDataBase.destroy({
        where:{
            projectId : null
        }
    });
};
fundDataBaseService.queryFolderSon= function (fatherid) {
    //where:{parentId: fatherId,originalName: name}
        return FundDataBase.all({
            where: {
                parentId: fatherid
            }
        });
};
fundDataBaseService.queryFileSon= function (fatherid) {
    //where:{parentId: fatherId,originalName: name}
    return FundDataBase.all({
        where: {
            parentId: fatherid
        }
    });
};

fundDataBaseService.getFundByProjectId = function (projectId) {
    return FundDataBase.all({
        where:{
            projectId: projectId,
            isFund:true
        },
        order: [["createdAt", "ASC"]]
    });
};
fundDataBaseService.getPayByProjectId = function (projectId) {
    return FundDataBase.all({
        where:{
            projectId: projectId,
            isFund:false
        },
        order: [["createdAt", "DESC"]]
    });
};
