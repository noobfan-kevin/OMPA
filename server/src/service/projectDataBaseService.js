/**
 * Created by HK059 on 2016/4/18.
 */
var ProjectDataBase=process.core.db.models.ProjectDataBase;//.core.db.models.ProjectDataBase;
var FileType=process.core.db.models.FileType;
var Creator = process.core.db.models.Creator;
var async = require('async');

var projectDataBaseService = module.exports;

projectDataBaseService.create = function (file) {
    return ProjectDataBase.create(file);
};

projectDataBaseService.getById = function (id) {
    return ProjectDataBase.findOne({
        where: {id: id},
        include : [Creator,FileType]
    });
};
projectDataBaseService.arrangeFolderTree=function(folders){
    // console.log(folders);
    var promises = folders.map(function (folder) {
        //console.log("===========121212211==============");
        //console.log(folder);
        return projectDataBaseService.getByFatherId(folder.id).then(function(files){
            folder.child=files;
            return folder;
        });
    });
    return Promise.all(promises);
};
projectDataBaseService.getByFatherId=function (fatherId,order) {
    if (!order) {
        order="ASC";
    }
    return ProjectDataBase.all({
        where:{parentId:fatherId},
        order: [["createdAt", order]]
    });
};

projectDataBaseService.getByOriginalName = function (name) {
    return ProjectDataBase.one({
        where:{originalName: name}
    });
};

projectDataBaseService.getByOriginalNameAndFatherId = function (fatherId,name,isFolder) {
    return ProjectDataBase.all({
        where:{
            parentId: fatherId,
            originalName: name,
            isFolder: isFolder
        }
    });
};

projectDataBaseService.queryBySourceKey = function (id) {
    return ProjectDataBase.all({
        where:{sourceKey:id}
    });
};

projectDataBaseService.findGroupFile = function (id) {
    return ProjectDataBase.all({
        where:{sourceKey:id},
        order: [["createdAt", "DESC"]]
    });
};

projectDataBaseService.updateById = function (id, file) {

    return ProjectDataBase.findOne({
        where: {id: id}
    }).then(function(dbfile){
        return dbfile.update(file);
    });

};

projectDataBaseService.deleteById = function (id) {
    return projectDataBaseService.getById(id).then(function (dbfile) {
        return dbfile.destroy();
    });
};
projectDataBaseService.deleteByIndex = function (projectId,index) {
    return ProjectDataBase.destroy({
        where:{
            projectId: projectId,
            index: {
                $iLike: index + '%'
            }
        }
    });
};
projectDataBaseService.deleteByProjectId = function () {
    return ProjectDataBase.destroy({
        where:{
            projectId : null
        }
    });
};
projectDataBaseService.queryFolderSon= function (fatherid,isall) {
    //where:{parentId: fatherId,originalName: name}
    if(!isall)
    {
        return ProjectDataBase.all({
            where: {
                parentId: fatherid,
                isFolder:true
            }
        });
    }
    else{
        return ProjectDataBase.all({
            where: {
                parentId: fatherid
            }
        });
    }
};
projectDataBaseService.queryFileSon= function (fatherid) {
    //where:{parentId: fatherId,originalName: name}
    return ProjectDataBase.all({
        where: {
            parentId: fatherid,
            isFolder:false
        }
    });
};
projectDataBaseService.queryFoldersByFather = function (father) {
    if (!father.isFolder) {
        return [];
    }
    return ProjectDataBase.all({
        where: {
            projectId: father.projectId,
            index: {
                $iLike:  father.index + '%'
            },
            isFolder:true
        },
        order: [["createdAt", "ASC"]]
    });
};
projectDataBaseService.queryFilesByFather = function (father) {
    if (!father.isFolder) {
        return [];
    }
    return ProjectDataBase.all({
        where: {
            projectId: father.projectId,
            index: {
                $iLike:  father.index + '%'
            },
            isFolder:false
        }
    });
};
projectDataBaseService.deleteFiles=function(ids){
    var promises = ids.map(function(id){
        return projectDataBaseService.getById(id).then(function(dbfile){
            if(dbfile)
            {
                if(!dbfile.dataValues.isFolder)
                {
                    return projectDataBaseService.deleteById(id);
                }
                else
                {
                    return projectDataBaseService.deleteByIndex(dbfile.dataValues.index);
                }
            }
        });
    });
    return Promise.all(promises);
};
projectDataBaseService.getFileMerge=function(ids){
    return projectDataBase.all({
        where: {
            id: {
                $in:  ids
            }
        }
    });
};
projectDataBaseService.getByProjectId = function (projectId,flag) {
    if (!flag) {
        return ProjectDataBase.all({
            where:{
                projectId: projectId
            },
            order: [["createdAt", "ASC"]]
        });
    }else{
        return ProjectDataBase.all({
            where:{
                projectId: projectId,
                isFolder: true
            },
            order: [["createdAt", "ASC"]]
        });
    }
};
projectDataBaseService.queryFolderFilesByFather = function (father) {
    /*if (!father.isFolder) {
        return [];
    }*/
    return ProjectDataBase.all({
        where: {
            projectId:  father.projectId,
            index: {
                $iLike: father.index + '%'
            }
        }
    });
};
projectDataBaseService.searchFilesByTitle = function(father,title){
    return ProjectDataBase.all({
        where: {
            projectId : father.projectId,
            isFolder : false,
            index: {
                $iLike : father.index + '%'
            },
            $or : [{
                originalName: {
                    $iLike: '%'+ title + '%'
                }
            }, {
                title: {
                    $iLike: '%'+ title + '%'
                }
            }]
        }
    });
};
projectDataBaseService.searchAllFilesByTitle = function(projectId,title){
    return ProjectDataBase.all({
        where: {
            projectId : projectId,
            isFolder : false,
            $or : [{
                originalName: {
                    $iLike: '%'+ title + '%'
                }
            }, {
                title: {
                    $iLike: '%'+ title + '%'
                }
            }]
        }
    });
};
projectDataBaseService.checkFileType = function(typeId){
    return ProjectDataBase.all({
        where: {
            type: typeId
        }
    });
};