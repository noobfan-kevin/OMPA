/**
 * Created by hk61 on 2016/6/17.
 */
var Voucher = process.core.db.models.Voucher;
var File = process.core.db.models.File;

var voucherService = module.exports;

voucherService.query = function(args){
    return Voucher.all(args);
};

voucherService.delete = function(args){
    return Voucher.all(args).then(function(dbs) {
        return dbs.destroy();
    })
};

voucherService.update = function(args){
    return Voucher.all(args).then(function(dbs) {
        return dbs;
    })
};

voucherService.create = function(prams){
    return Voucher.create(prams);
};
