/**
 * Created by hk60 on 2016/4/12.
 */
var AssetType = process.core.db.models.AssetsType;
var log = process.core.log;
var userService = require('./userService');
var AssetTypeService = module.exports;




AssetTypeService.create = function (assetType) {
    return AssetType.create(assetType);
};

// 批量创建
AssetTypeService.createAll = function (assetTypes) {
    return AssetType.bulkCreate(assetTypes);
};


AssetTypeService.query = function (args) {

    return AssetType.all(args);
};

AssetTypeService.deleteById = function (id) {
    return AssetType.findById(id).then(function (dbAssetType) {
        return dbAssetType.destroy();
    });
};
AssetTypeService.getById = function(id){
    return AssetType.findById(id);
};
AssetTypeService.updateById = function(id,AssetTypeName){
    return AssetType.findById(id).then(function (dbAssetType){
        return dbAssetType.update(AssetTypeName);
    })
};