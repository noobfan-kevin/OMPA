/**
 * Created by hk60 on 2016/4/13.
 */
var AssetInfo = process.core.db.models.AssetsInfo;
var AssetsType=process.core.db.models.AssetsType;
var User=process.core.db.models.User;
var Task = process.core.db.models.Task;
var creator = process.core.db.models.creator;
var productor = process.core.db.models.productor;
var TaskVersion = process.core.db.models.TaskVersion;
var log = process.core.log;
var userService = require('./userService');
var AssetInfoService = module.exports;

AssetInfoService.create = function (assetType) {
    return AssetInfo.create(assetType);
};
AssetInfoService.query = function (args) {

    return AssetInfo.all(args,{
        include:[Task]
    });
};

AssetInfoService.findAssetById = function(id){
    return AssetInfo.findById(id,{
        include:[AssetsType]
    });
};

AssetInfoService.getAssetById = function(id){
    return AssetInfo.findById(id,{
        include:[AssetsType,{model:Task,include:[{model:TaskVersion}]}]
    });
};

AssetInfoService.assetTotal = function (projectId) {
    return AssetInfo.findAndCountAll({
        where:{projectId:projectId}
    });
};

AssetInfoService.getOnePageAssets=function(offset,projectId){
    return AssetInfo.all({
        include:[AssetsType,{model:Task,include:[{model:TaskVersion,include:[creator,productor]}]}],
        where:{projectId:projectId},
        order:[ ['createdAt','DESC']],
        offset:offset*10,
        limit:10
    });
};

AssetInfoService.updateById = function (id, asset) {
    return AssetInfo.findById(id).then(function (dbAsset) {
        return dbAsset.update(asset);
    });
};

AssetInfoService.deleteById = function (id) {
    return AssetInfo.findById(id).then(function (dbAsset) {
        return dbAsset.destroy();
    });
};

AssetInfoService.getAssetsByTypeId = function(id){
    return AssetInfo.findAndCountAll({
        where:{type:id}
    });
};