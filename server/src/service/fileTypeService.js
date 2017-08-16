/**
 * Created by HK059 on 2016/6/1.
 */
var FileType = process.core.db.models.FileType;
var FileTypeService = module.exports;




FileTypeService.create = function (fileType) {
    return FileType.create(fileType);
};

// 批量创建
FileTypeService.createAll = function (fileTypes) {
    return FileType.bulkCreate(fileTypes);
};


FileTypeService.query = function (args) {

    return FileType.all(args);
};

FileTypeService.deleteById = function (id) {
    return FileType.findById(id).then(function (dbFileType) {
        return dbFileType.destroy();
    });
};

FileTypeService.updateById = function(id,FileTypeName){
    return FileType.findById(id).then(function (dbFileType){
        return dbFileType.update(FileTypeName);
    })
};