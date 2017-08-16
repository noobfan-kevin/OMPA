/**
 * Created by HK059 on 2016/6/14.
 */
var publicDataBase=process.core.db.models.PublicDataBase;//.core.db.models.publicDataBase;
var Creator = process.core.db.models.Creator;
var async = require('async');

var publicDataBaseService = module.exports;

publicDataBaseService.create = function (file) {
    return publicDataBase.create(file);
};

publicDataBaseService.getById = function (id) {
    return publicDataBase.findOne({
        where: {id: id},
        include : [Creator]
    });
};
publicDataBaseService.getByFatherId=function (fatherId,order) {
    if (!order) {
        order="ASC";
    }
    return publicDataBase.all({
        where:{parentId:fatherId},
        order: [["createdAt", order]]
    });
};
publicDataBaseService.getAllNodes = function (flag) {
    return publicDataBase.all({
        where:{
            isFolder: flag
        },
        order: [["createdAt", "ASC"]]
    });
};
publicDataBaseService.getByOriginalNameAndFatherId = function (fatherId,name,isFolder) {
    return publicDataBase.all({
        where:{
            parentId: fatherId,
            originalName: name,
            isFolder: isFolder
        }
    });
};
publicDataBaseService.updateById = function (id, file) {

    return publicDataBase.findOne({
        where: {id: id}
    }).then(function(dbfile){
        return dbfile.update(file);
    });

};

publicDataBaseService.deleteById = function (id) {
    return publicDataBaseService.getById(id).then(function (dbfile) {
        return dbfile.destroy();
    });
};
publicDataBaseService.deleteByIndex = function (index) {
    return publicDataBase.destroy({
        where:{
            index: {
                $iLike: index + '%'
            }
        }
    });
};
publicDataBaseService.queryFolderSon= function (fatherid,isall) {
    //where:{parentId: fatherId,originalName: name}
    if(!isall)
    {
        return publicDataBase.all({
            where: {
                parentId: fatherid,
                isFolder:true
            }
        });
    }
    else{
        return publicDataBase.all({
            where: {
                parentId: fatherid
            }
        });
    }
};
publicDataBaseService.queryFileSon= function (fatherid) {
    //where:{parentId: fatherId,originalName: name}
    return publicDataBase.all({
        where: {
            parentId: fatherid,
            isFolder:false
        }
    });
};
publicDataBaseService.queryFoldersByFather = function (father) {
    if (!father.isFolder) {
        return [];
    }
    return publicDataBase.all({
        where: {
            index: {
                $iLike:  father.index + '%'
            },
            isFolder:true
        },
        order: [["createdAt", "ASC"]]
    });
};
publicDataBaseService.queryFilesByFather = function (father) {
    if (!father.isFolder) {
        return [];
    }
    return publicDataBase.all({
        where: {
            index: {
                $iLike:  father.index + '%'
            },
            isFolder:false
        }
    });
};
publicDataBaseService.queryFolderFilesByFather = function (father) {
    return publicDataBase.all({
        where: {
            index: {
                $iLike: father.index + '%'
            }
        }
    });
};
publicDataBaseService.searchFilesByTitle = function(father,keyWord){
    return publicDataBase.all({
        where: {
            projectId : father.projectId,
            isFolder : false,
            index: {
                $iLike : father.index + '%'
            },
            title: {
                $iLike: '%'+ keyWord + '%'
            }
        }
    });
};
publicDataBaseService.getPageCountByFatherId=function (fatherId) {
    return publicDataBase.count({
        where:{parentId:fatherId}
    });
};