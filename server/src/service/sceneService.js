/**
 * Created by hk60 on 2016/4/21.
 */
var Scene = process.core.db.models.Scene;
var chang = process.core.db.models.chang;
var ji = process.core.db.models.ji;
var Task = process.core.db.models.Task;
var creator = process.core.db.models.creator;
var productor = process.core.db.models.productor;
var TaskVersion = process.core.db.models.TaskVersion;
var log = process.core.log;
var sceneService = module.exports;

sceneService.create = function (scene) {
    return Scene.create(scene);
};

sceneService.assetTotal = function (jiId) {
    return Scene.findAndCountAll({
        where:{jiId:jiId}
    });
};

sceneService.query = function (id,offset) {
    return Scene.all({
        include:[chang,{model:Task,include:[{model:TaskVersion,include:[creator,productor]}]}],
        where:{jiId:id},
        offset:offset*10,
        limit:10,
        order:[["changId"],["createdAt","DESC"]]
    });
};

sceneService.getShotById = function(id){
    return Scene.findById(id,{
        include:[chang,ji,{model:Task,include:[{model:TaskVersion}]}]
    });
};
sceneService.updateById = function (id, shot) {
    return Scene.findById(id,{
        include:[chang,ji]
    }).then(function (dbScene) {
        return dbScene.update(shot);
    });
};

sceneService.deleteById = function (id) {
    return Scene.findById(id).then(function (dbshot) {
        return dbshot.destroy();
    });
};

sceneService.getSceneByNodeId = function(id){
    return Scene.findAndCountAll({
        where:{
            $or:[
                {changId:id},
                {jiId:id}
            ]
        }
    });
};