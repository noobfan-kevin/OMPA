/**
 * Created by hk60 on 2016/6/12.
 */
var Supplement = process.core.db.models.SupplementaryAgreement;
var Contract = process.core.db.models.Contract;
var log = process.core.log;
var SAgreementService = module.exports;

SAgreementService.query = function(args) {
    var attributes = args.attributes;
    var where = args.where || {};
    var offset = args.offset || 0;
    var limit = args.limit;
    var order = args.order || ['createdAt'];
    var include = args.include || [Contract];

    return Supplement.all({
        attributes: attributes,
        where: where,
        offset: offset,
        limit: limit,
        order: order,
        include: include
    })

};

SAgreementService.create = function (info) {
    return Supplement.create(info);
};

SAgreementService.getAgreement = function (id) {
    return Supplement.findById(id, {
        include:[Contract]
    });
};


SAgreementService.allByContractId = function(contractId) {
    return SAgreementService.query({
        where: {
            contractId: contractId
        }
    })
};
