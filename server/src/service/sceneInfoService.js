/**
 * Created by hk60 on 2016/4/18.
 */

var SceneInfo = process.core.db.models.SceneInfo;
var Scene = process.core.db.models.Scene;
var log = process.core.log;
var sceneInfoService = module.exports;
var father = process.core.db.models.sceneTreeFather;
var children =process.core.db.models.sceneTreeChildren;

sceneInfoService.create = function (scene) {
    return SceneInfo.create(scene);
};
sceneInfoService.query = function(id,args) {

    return SceneInfo.all({
        where:{
            $or:[
                {projectId:id},
                {fatherId:null}
            ]
        }
    },args);
};
sceneInfoService.getChildren = function(id,pId) {
    return SceneInfo.all({
        where:{fatherId:id,projectId:pId}
    });
};

sceneInfoService.getSuperFatherId =function(){
    return SceneInfo.all({
        where:{fatherId:null}
    });
};

sceneInfoService.getSceneById = function(id){
    return SceneInfo.findById(id,{
       include: [father,children]
    });
};

sceneInfoService.updateById = function (id, sceneTree) {
    return SceneInfo.findById(id).then(function (dbScene) {
        return dbScene.update(sceneTree);
    });
};

sceneInfoService.deleteById = function (id) {
    return SceneInfo.findById(id).then(function (dbscene) {
        return dbscene.destroy();
    });
};

