/**
 * Created by hk60 on 2016/6/2.
 */
var PartAInfo = process.core.db.models.partAInfo;
var log = process.core.log;
var partAInfoService = module.exports;


partAInfoService.create =function(info){
    return PartAInfo.create(info);
};
partAInfoService.query = function (args) {

    return PartAInfo.all(args);
};

partAInfoService.getById = function(id){
    return PartAInfo.findById(id);
};
partAInfoService.updateById = function(id,info){
    return PartAInfo.findById(id).then(function (db){
        return db.update(info);
    })
};