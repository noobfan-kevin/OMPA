/**
 * Created by hk60 on 2016/6/3.
 */
var Contract = process.core.db.models.Contract;
var TaskVersion = process.core.db.models.TaskVersion;
var Progress = process.core.db.models.Progress;
var Task = process.core.db.models.Task;
var log = process.core.log;
var ContractService = module.exports;

var taskVersionService = require('./taskVersionService');




ContractService.create = function (info) {
    return Contract.create(info);
};


ContractService.query = function (args) {

    return Contract.all(args);
};

ContractService.updateByModuleId = function(where,info){
    console.log(where,info,'dasgdasuhkdasda');
    return Contract.update(info,{where:where});
};

ContractService.getListByFilter = function (where) {

    return Contract.findAndCountAll(
        {
            where:where
        }
    ).then(function(data){
        return data.count;
    }).catch(function(data){
        console.log('err',data);
    });
};
ContractService.getOnePageContractList = function (args) {
    var where={};
    var status = args.contractStatus||[];
    if(status.length==0){
    }else{
        where.contractStatus=
        {
            $in:status
        }
    }
    if(args.creator){
        where.creatorId = args.creator;
    }
    where.projectId=args.projectId;
    return Contract.findAll({
        where:where,
        order:[ ['createdAt','DESC'] ],
        offset:args.offset*10,
        limit:10
    });
};

ContractService.getById = function(id){
    return Contract.findById(id ,{include: [{model:User, as: 'contractLeader', attribute: ['id', 'name']}]});
};
ContractService.getCount = function(args){
    var where={};
    var status = args.contractStatus||[];
    console.log(status,'statadasdasdasa');
    if(status.length==0){
    }else{
        where.contractStatus=
            {
                $in:status
            }
    }
    if(args.creator){
        where.creatorId = args.creator;
    }
    where.projectId=args.projectId;
    return Contract.findAndCountAll(
        {
            where:where
        }
    ).then(function(data){
        return data.count;
    }).catch(function(data){
        console.log('err',data);
    });
};
ContractService.deleteById = function (id) {
    return Contract.findById(id).then(function (db) {
        return db.destroy();
    });
};

ContractService.updateById = function(id,info){
    return Contract.findById(id).then(function (db){
        return db.update(info);
    })
};


ContractService.updateStatusById = function(id,args){
    return Contract.findById(id).then(function (db){
        //console.log(db,'1111111111111111111111');
        var info={};
        var status = db.contractStatus;
        console.log(status,'12312312312312312');
        if(args.readerId){
            if(db.read==''){
                info.read=args.readerId;
            }else{
                if(db.read.indexOf(args.readerId)==-1){
                    info.read=db.read+','+args.readerId;
                    if(status==7 && args.readerId==db.contractLeaderId){
                        info.contractStatus = 4;
                    }
                }

            }
        }
        if(args.contractStatus){
            info.contractStatus=args.contractStatus;
            if(status!=args.contractStatus && args.contractStatus!=4){
                info.read = '';
            }
            if(args.contractStatus==2){
                taskVersionService.updateTaskStutas({versionId:db.taskCardVersionId,status:1,userId:db.contractLeaderId});
            }
            if(args.contractStatus==4&&db.paidStep==1){
                taskVersionService.updateTaskStutas({versionId:db.taskCardVersionId,status:2,readStatus:'false'});
                var m_data = new Date();
                info.signTime = m_data.getFullYear()+"-"+(parseInt(m_data.getMonth())+ 1) + '-'+m_data.getDate();
            }
        }
        if(args.paidStep){
            info.paidStep=args.paidStep;
        }
        //console.log(info,'dasuygdasuhdklasdha');
        return db.update(info);
    })
};

ContractService.getContractById = function(args){
    if(args.type==1){
        return Contract.findAndCountAll({
            where:{
                contractLeaderId:args.userId,
                contractStatus:{$in:[3,4,6,7]},
                read:{
                    $notLike:'%'+args.userId+'%'
                }
            }
        }).then(function(db){
            return db.count;
        });
    }else if(args.type==2){
        return Contract.findAndCountAll({
            where:{
                paidManId:args.userId,
                contractStatus:5,
                read:{
                    $notLike:'%'+args.userId+'%'
                }
            }
        }).then(function(db){
            return db.count;
        });
    }else if(args.type==3){
        return Contract.findAndCountAll({
            where:{
                partBId:args.userId,
                contractStatus:{$in:[2,4,6,7]},
                read:{
                    $notLike:'%'+args.userId+'%'
                }
            }
        }).then(function(db){
            return db.count;
        });
    }else{

    }
};


ContractService.queryByStatus = function(args) {
    var attributes = args.attributes;
    var where = args.where || {};
    var limit = args.limit || 10;
    var offset = args.offset || args.page || 0;
    var order = args.order || ['createdAt'];
    var include = args.include || [{
            model:TaskVersion,
            attributes:['id'],
            include: [{
                model: Progress,
                attributes:['id','step','percent','status']
            }]
        }];

    var status = where.contractStatus;
    where.contractStatus = {
        $in: status
    };
    if( !Array.isArray(status) || status.length === 0 ){
        delete where.contractStatus;
    }

    return Contract.findAndCount({
        attributes: attributes,
        where: where,
        offset: offset * limit,
        limit: limit,
        order: order,
        include: include
    })
};
//获取主页个人合同由我发送个数
ContractService.getToDealtSendContractCount=function(data){
        return Contract.findAndCountAll({where:{contractLeaderId:data.userId,contractStatus:{$in:[1,3]}}}).then(function(count){
             return count.count;
        });
}
//获取主页个人合同由我签约个数
ContractService.getToDealtSignContractCount=function(data){
    return Contract.findAndCountAll({where:{partBId:data.userId,contractStatus:{$in:[2,7]}}}).then(function(count){
        var _length=count.rows.length;
        if(_length!=0){
            var status2= 0,status7=0;
            for(var i=0;i<_length;i++){
                if(count.rows[i].contractStatus==2){
                    status2+=1;
                }else{
                    status7+=1;
                }
            }
            return {signCount:status2,sureCount:status7};
        }else{
            return {signCount:0,sureCount:0};
        }
    });
}
//获取主页个人合同由我支付个数
ContractService.getToDealtPayContractCount=function(data){
    return Contract.findAndCountAll({where:{paidManId:data.userId,contractStatus:5}}).then(function(count){
        return count.count;
    });
}
//获取主页个人合同待指派给支付人的合同个数
ContractService.getToDealtAssignContractCount=function(data){
    return Contract.findAndCountAll({where:{contractLeaderId:data.userId,contractStatus:4},include:[TaskVersion]}).then(function(count){
         var _length=count.rows.length;
         var rows=count.rows;
         if(_length!=0){
             var array=0,payType=[],payProcess=0;
             for(var i=0;i<_length;i++){
                  payType=rows[i].payType.split('-');
                 for(var j=0;j<parseInt(rows[j].paidStep)-1;j++){
                     payProcess+=parseInt(payType[j]);
                 }
                if(parseInt(rows[i].TaskVersion.completeProgress)>(payProcess*10)||payProcess==0){
                     array+=1;
                }
             }
             return array;
         }else{
             return 0;
         }
    });
}
ContractService.getAllToDealContractCount=function(data){
    return ContractService.getToDealtSendContractCount(data).then(function(sendCount){
        return ContractService.getToDealtSignContractCount(data).then(function(signCount){
            return ContractService.getToDealtPayContractCount(data).then(function(payCount){
                return ContractService.getToDealtAssignContractCount(data).then(function(assignCount){
                    return {sendContract:sendCount,signContract:signCount.signCount,sureContract:signCount.sureCount,payContract:payCount,assignPayContract:assignCount};
                });
            });
        });
    });
}
