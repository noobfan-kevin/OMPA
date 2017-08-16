/**
 * Created by hk60 on 2016/6/1.
 */
!function(){
    var ContractManagement = angular.module('contractManagement', ['view', 'ui.router','contractEdit','contractNew']);

    ContractManagement.controller('contractManagementController',['$scope','$http','$state', '$rootScope',function($scope,$http,$state,$rootScope){
            $scope.project = null;
            $scope.user = null;
            $scope.projectName = '';
            $scope.contractFilter = false;
            $scope.filterStatus = false;
            $scope.contract_filter = {
                unsend : false,
                sended : false,
                backed : false,
                going : false,
                paid : false,
                unpaid : false,
                finished : false
            };
            $scope.contract_temp_filter = {
                unsend : false,
                sended : false,
                backed : false,
                going : false,
                paid : false,
                unpaid : false,
                finished : false
            };
            $scope.Filter=[];
            var stepList = [];
            $scope.curUserId = localStorage.getItem("userId");
            $scope.projectId = localStorage.getItem("projectId");
            $scope.partA = {};
            /*=========================上面为新建相关===================================*/
            $scope.contractList =[];
            $scope.contractNum = 0;
            $scope.totalPage = 0;
            $scope.pageList = [];
            $scope.pageListShow = false;
            $scope.currentPage = 1;
            $scope.currentContract ={"name":'', "code":'', "type":'', "connectTask":'', "creator":'', "payMan":'', "partBName":'', "startTime":'', "endTime":'', "signTime":'', "finishedPercent":'', "paidPercent":''};
            //if(sessionStorage.getItem('contractManagement')){
            //
            //}else {
            //    console.log('一次加载');
            //    sessionStorage.setItem('contractManagement', true);
            //}


            /**
             * 获取项目信息
             */
            $.ajax({
                method:'get',
                url:'/api/project/'+$scope.projectId,
                success:function(success){
                    $scope.$apply(function(){
                        $scope.projectName = success.list.name;
                    })
                },
                error:function(err){
                    console.log(err);
                }
            });

            /**
             * 获取用户
             */
            $.ajax({
                method:'get',
                url:'/api/user/'+$scope.curUserId,
                success:function(success){
                    $scope.$apply(function(){
                        $scope.user = success;
                    })
                },
                error:function(err){
                    console.log(err);
                }
            });

            /**
             * 获取甲方信息
             */
            new Promise(function(resolve,reject){
                $.ajax({
                    method:'get',
                    url: '/api/partAInfo/getPartAInfo',
                    success: function (success) {
                        resolve(success);
                    },
                    error: function (err) {
                        reject(err);
                    }
                })
            })
                .then(function(success){
                    $scope.$apply(function(){
                        $scope.partA.id =success[0].id;
                        $scope.partA.name =success[0].name;
                        $scope.partA.phone =success[0].phone;
                        $scope.partA.email =success[0].email;
                        $scope.partA.location =success[0].location;
                    });
                },function(err){
                    console.log(err);
                })
                .catch(function(data){
                    console.log(data);
                });

            /**
             * 获取合同列表
             */
            new Promise(function(resolve,reject){
                var data={};
                //if(projectCommon.authority.manageAllContracts || projectCommon.authority.isProjectLeader){
                    data.contractStatus=$scope.Filter;
                    data.projectId=$scope.projectId;
                    data.offset = '0';
                //}else{
                //    data.offset = '0';
                //    data.contractStatus=$scope.Filter;
                //    data.projectId=$scope.projectId;
                //    data.creator=$scope.curUserId;
                //}
                $.ajax({
                    method:'get',
                    url:'/api/contract/count',
                    data:data,
                    success:function(success){
                        //console.log(success);
                        $scope.$apply(function(){
                            $scope.contractNum = success;
                            $scope.totalPage = Math.ceil(parseInt($scope.contractNum)/10);
                            var len = $scope.totalPage;
                            for(;len>0;){
                                $scope.pageList.push(len--);
                            }
                        });
                        if($scope.contractNum!=0){
                            resolve(data);
                            $('.contract-tableContain').show();
                            $('.noContract-page').hide();
                        }
                    },
                    error:function(err){
                        reject(err);
                    }
                });
            })
                .then(function(data){
                    $.ajax({
                        method:'get',
                        url:'/api/contract/getOnePageContractList',
                        data:data,
                        success:function(data){
                            //console.log('111111111',data);
                            $scope.contractList=[];
                            var len = data.length;
                            var success = null;
                            var percent = null;
                            var p_percent = null;
                            $scope.$apply(function(){
                                for(var i=0;i<len;i++){
                                    success = data[i].lists;
                                    //console.log(success,'dasjgdjashdkjsahkld');
                                    percent = data[i].percent;
                                    p_percent = $scope.getPercentOfPaid(success.paidStep,success.payType);
                                    $scope.contractList.push({
                                        "contractCode":success.contractCode,
                                        "contractName":success.contractName,
                                        "crater":success.creator,
                                        "payMan":success.paidMan,
                                        "partBName":success.partBName,
                                        "taskCardStartTime":success.taskCardStartTime,
                                        "taskCardEndTime":success.taskCardEndTime,
                                        "payJindu":p_percent,
                                        "taskJindu":percent,
                                        "contractStatus":success.contractStatus,
                                        "statusName":$scope.getStatusOfContract(success.contractStatus),
                                        "id":success.id
                                    });
                                }
                            });
                        },
                        error:function(err){
                            console.log(err);
                        }

                    })
                },function(err){
                    console.log(err);
                })
                .catch(function(data){
                    console.log(data);
                });

            //}//TODO if 结尾

            $scope.whetherShowNeedPay= function(taskPercent, payPercent){

                if(parseInt(this.contract.contractStatus)!= 4)//合同是状态是“进行中”才判断
                {
                    return false;
                }

                return $.whetherNeedPay(taskPercent, payPercent);
            };


            /**
             * 页面跳转框的隐藏处理
             */
            angular.element('#contract-management').off('click').on('click',function(e){
                //console.log(e);
                if(e.target.attributes[0]){
                    if(e.target.attributes[0].value=='cur-page ng-binding'){
                        $scope.$apply($scope.contractFilter = false);
                    }else if(e.target.parentElement.className=="list-head-dropBtn"){
                        $scope.$apply($scope.pageListShow = false);
                    }else if(e.target.className=="list-head-dropBtn"){
                        $scope.$apply($scope.pageListShow = false);
                    }else if(e.target.className =='contract-list-dropdown contract-list-filter'){
                    }else if(e.target.parentElement.className =='contract-list-dropdown contract-list-filter'){
                    }else if(e.target.className =='filter-li'){
                    }else if(e.target.parentElement.className =='filter-li'){
                    }
                    else{
                        $scope.$apply($scope.pageListShow = false,$scope.contractFilter = false,$scope.contract_filter = $scope.contract_temp_filter);
                    }
                }
            });

            $scope.getPercentOfPaid =function(paid,type){
                //console.log(paid,type,'111111111');
                var typeArr =  type.split('-');
                var percent = 0;
                for(var i=0;i<paid-1;i++){
                    percent+=parseInt(typeArr[i]);
                }
                //console.log(percent,'22222222222');
                return percent*10+'%';
            };

            /**
             * 获取甲方信息
             */
            $scope.getPartAInfo = function(){
                new Promise(function(resolve,reject){
                    $.ajax({
                        method:'get',
                        url: '/api/partAInfo/getPartAInfo',
                        success: function (success) {
                            resolve(success);
                        },
                        error: function (err) {
                            reject(err);
                        }
                    })
                }).then(function(success){
                    $scope.partA.id =success[0].id;
                    $scope.partA.name =success[0].name;
                    $scope.partA.phone =success[0].phone;
                    $scope.partA.email =success[0].email;
                    $scope.partA.location =success[0].location;
                },function(err){
                    console.log(err);
                }).catch(function(data){
                    console.log(data);
                });
            };

            $scope.getStatusOfContract = function(status){
                switch (status){
                    case 1:
                        return '未发送';
                    case 2:
                        return '已发送';
                    case 3:
                        return '已退回';
                    case 4:
                        return '进行中';
                    case 5:
                        return '待支付';
                    case 6:
                        return '已完成';
                    case 7:
                        return '已支付';

                }
            };

            /**
             * 获取任务卡列表
             * @param nodeList
             */
            //$scope.getTasks = function(nodeList){
            //    $scope.taskCardOptions=[];
            //    new Promise(function(resolve,reject){
            //        var len = nodeList.length;
            //        var nodeId = null;
            //        for(;len>0;){
            //            nodeId=nodeList[--len];
            //            $.ajax({
            //                method:'get',
            //                url:'/api/taskCard/getStepTasks/'+nodeId,
            //                success:function(success){
            //                    console.log(success,'taskaklsdjaklsjdjklasn');
            //                    var t_len = success.length;
            //                    if(t_len>0){
            //                        for(var i=0;i<t_len;i++){
            //                            $scope.taskCardOptions.push({
            //                                "id":success[i].TaskVersions[0].id,
            //                                "name":success[i].TaskVersions[0].name,
            //                                "startTime":success[i].TaskVersions[0].startDate.slice(0,10),
            //                                "endTime":success[i].TaskVersions[0].planDate.slice(0,10),
            //                                "modelName":success[i].StepInfo.name,
            //                                "modelId":nodeId
            //                            })
            //                        }
            //                    }
            //                },
            //                error:function(err){
            //                    console.log(err);
            //                }
            //            })
            //        }
            //    })
            //};

            /**
             * 筛选框显示隐藏切换函数
             */
            $scope.showFilter = function(){
                $scope.contractFilter=!$scope.contractFilter;
            };

            /**
             * 用户选择完筛选条件够，点击确定按钮触发条件
             */
            $scope.doFilter = function(){
                $scope.Filter = [];
                if($scope.contract_filter.unsend){
                    $scope.Filter.push('1');
                }
                if($scope.contract_filter.sended){
                    $scope.Filter.push('2');
                }
                if($scope.contract_filter.backed){
                    $scope.Filter.push('3');
                }
                if($scope.contract_filter.going){
                    $scope.Filter.push('4');
                }
                if($scope.contract_filter.paid){
                    $scope.Filter.push('7');
                }
                if($scope.contract_filter.unpaid){
                    $scope.Filter.push('5');
                }
                if($scope.contract_filter.finished){
                    $scope.Filter.push('6');
                }
                if($scope.Filter.length==0){
                    $scope.filterStatus = false;
                }else{
                    $scope.filterStatus = true;
                }
                console.log($scope.Filter);
                $scope.contract_temp_filter = $scope.contract_filter;
                $scope.initContractNum($scope.Filter,$scope.curUserId,$scope.projectId);
                $scope.showFilter();
            };

            /**
             * 任务卡select
             */
            //$scope.showTheOption = function(){
            //    $scope.contract.startTime = $scope.contract.taskCard.startTime;
            //    $scope.contract.endTime = $scope.contract.taskCard.endTime;
            //    $scope.contract.type = $scope.contract.taskCard.modelName;
            //    $scope.contract.typeId = $scope.contract.taskCard.modelId;
            //    $scope.contract.taskId = $scope.contract.taskCard.id;
            //    $scope.contract.taskCardName = $scope.contract.taskCard.name;
            //};

            /**
             * 新建合同-输入金额后获取步骤金额
             */
            //$scope.getThreeStepsMoney = function(){
            //    $scope.contractMoney.first =  Math.round($scope.contractMoney.total*0.2);
            //    $scope.contractMoney.second =  Math.round($scope.contractMoney.total*0.3);
            //    $scope.contractMoney.third = $scope.contractMoney.total-$scope.contractMoney.first-$scope.contractMoney.second;
            //    };

            /**
             * 甲方界面
             */
            $scope.showPartA = function(){
                $('.checkPartA-contain').show();
            };

            /**
             * 选择乙方界面
             */
            //$scope.showPartB = function(){
            //    $('.checkPartB-contain').show();
            //};

            /**
             * 甲方设置界面-取消
             */
            $scope.cancelSetPartA =function(){
                $('.checkPartA-contain').hide();
                $scope.getPartAInfo();
            };

            /**
             * 甲方设置界面-确定
             */
            $scope.saveSetPartA = function(){
                if($scope.partA.name==''){
                    projectCommon.quoteUserWarning('#partA-name','100px','56px','请正确输入甲方名称');
                } else if($scope.partA.phone==''){
                    projectCommon.quoteUserWarning('#partA-phone','100px','116px','请正确输入甲方电话');
                }else if($scope.partA.email==''){
                    projectCommon.quoteUserWarning('#partA-email','100px','172px','请正确输入甲方邮箱');
                }else if($scope.partA.location==''){
                    projectCommon.quoteUserWarning('#partA-location','100px','232px','请正确输入甲方地址');
                }else{
                    var data = {
                        "name":$scope.partA.name,
                        "phone":$scope.partA.phone,
                        "email":$scope.partA.email,
                        "location":$scope.partA.location
                    };
                    $.ajax({
                        method:'put',
                        url:'/api/partAInfo/'+$scope.partA.id,
                        data:data,
                        success:function(success){
                            console.log(success);
                            $scope.cancelSetPartA();
                        },
                        error:function(err){
                            console.log(err);
                        }
                    });
                }
            };

            /**
             * 乙方选择界面-取消
             */
            //$scope.cancelCheckPartB = function(){
            //    $('.checkPartB-contain').hide();
            //};

            /**
             * 乙方选择界面-确定
             */
            //$scope.saveCheckPartB = function(){
            //    //TODO 临时选择的变量里面数据传递到PartB的MODEL里面
            //    //$scope.partB_check.id;
            //    $scope.partB=$scope.partB_check;
            //    if($scope.partB_check.type==1){
            //        $scope.userType_show = false;
            //    }else{
            //        $scope.userType_show = true;
            //    }
            //    $('.checkPartB-contain').hide();
            //};

            /**
             * 乙方选择界面-搜索
             */
            //$scope.searchInputFunc = function(){
            //    if($scope.searchInput==''){
            //        $scope.searchSpan=true;
            //    }else{
            //        $scope.searchSpan=false;
            //    }
            //        //console.log($scope.searchInput);
            //        new Promise(function(resolve,reject){
            //            $.ajax({
            //                method:'post',
            //                url:'/api/user/selectOuterUser',
            //                data:{"name":$scope.searchInput},
            //                success:function(success){
            //                    resolve(success);
            //                },
            //                error:function(err){
            //                    reject(err);
            //                }
            //            })
            //        }).then(function(success){
            //            //TODO
            //            //console.log('aaaaaaaaaaa',success);
            //            $scope.$apply($scope.sysPartBInfo(success));
            //        },function(err){
            //            console.log(err);
            //        }).catch(function(data){
            //            console.log(data);
            //        });
            //
            //};

            /**
             * 新建合同，获取乙方信息
             */
            $scope.newContract = function(){
                localStorage.setItem('newContractFrom','list');
                location.href = '#/contractNew';
            };
            //    $('.contracts-new').show();
            //    $('.contracts-list').hide();
            //    new Promise(function(resolve,reject){
            //        $.ajax({
            //            method:'post',
            //            url:'/api/user/getOuterUser',
            //            success:function(success){
            //                resolve(success);
            //            },
            //            error:function(err){
            //                reject(err);
            //            }
            //        })
            //    }).then(function(success){
            //        console.log('ldahsdjkahsdkajkjkajkaadajsd',success);
            //        $scope.sysPartBInfo(success);
            //    },function(err){
            //        console.log(err);
            //    }).catch(function(data){
            //        console.log(data);
            //    });
            //};

            /**
             * 获取乙方信息后，分类个人或公司
             * @param success
             */
            //$scope.sysPartBInfo = function(success){
            //    $scope.persons=[];
            //    $scope.companys=[];
            //    var len = success.length;
            //    for(var i=len;i>0;i--){
            //        if(success[i-1].Role.name=='签约方'){
            //            if(success[i-1].userType==1){
            //                $scope.persons.push({
            //                    "id":success[i-1].id,
            //                    "name":success[i-1].name,
            //                    "companyName":success[i-1].companyName,
            //                    "phone":success[i-1].phone,
            //                    "email":success[i-1].email,
            //                    "userCardId":success[i-1].userCardId,
            //                    "accountName":success[i-1].accountName,
            //                    "account":success[i-1].account,
            //                    "src":configInfo.server_url+'/'+success[i-1].image,
            //                    "type":success[i-1].userType
            //                })
            //            }else{
            //                $scope.companys.push({
            //                    "id":success[i-1].id,
            //                    "name":success[i-1].name,
            //                    "companyName":success[i-1].companyName,
            //                    "phone":success[i-1].phone,
            //                    "email":success[i-1].email,
            //                    "address":success[i-1].address,
            //                    "accountName":success[i-1].accountName,
            //                    "account":success[i-1].account,
            //                    "src":configInfo.server_url+'/'+success[i-1].image,
            //                    "type":success[i-1].userType
            //                })
            //            }
            //        }
            //    }
            //};

            /**
             * 处理覆盖input造成的无法获取焦点
             * @param $event
             */
            //$scope.transportClick = function($event){
            //    //console.log($event);
            //    if($event.target.tagName=='I'){
            //        $event.target.offsetParent.previousElementSibling.focus();
            //    }else if($event.target.tagName=='SPAN'){
            //        $event.target.previousElementSibling.focus();
            //    }
            //  //$event.target.previousElementSibling.focus();
            //};

            /**
             * 选择乙方界面，点击切换显示个人或者公司
             * @param type
             */
            //$scope.showPartBList = function(type){
            //    if(type=='company'){
            //        if($scope.company_show){
            //            $scope.company_show=false;
            //            $('.partB-company div i').html('&#xe67a;');
            //        }else{
            //            $('.partB-company div i').html('&#xe67b;');
            //            $('.partB-person div i').html('&#xe67a;');
            //            $scope.company_show=true;
            //            $scope.person_show=false;
            //        }
            //
            //    }else{
            //        if($scope.person_show){
            //            $scope.person_show=false;
            //            $('.partB-person div i').html('&#xe67a;');
            //        }else{
            //            $('.partB-company div i').html('&#xe67a;');
            //            $('.partB-person div i').html('&#xe67b;');
            //            $scope.company_show=false;
            //            $scope.person_show=true;
            //        }
            //    }
            //};

            /**
             * 点击选择一个乙方
             * @param $event
             * @param data
             */
            //$scope.checkThisAsPartB = function($event,data){
            //    //console.log(data);
            //    $scope.partB_check = data;
            //    $('.partB-list i').html('&#xe63f;');
            //    $event.target.innerHTML = '&#xe68e;';
            //};

            /**
             * 取消新建合同
             */
            //$scope.cancelNewContract = function(){
            //    $scope.contract = {name:'', code:'', type:'', taskCard:'', startTime:'', endTime:'',taskId:''};
            //    $scope.contractMoney = {"total":'', "first":0, "second":0, "third":0};
            //    $scope.partB={};
            //    $('.contracts-list').show();
            //    $('.contracts-new').hide();
            //};

            /**
             * 新建合同
             */
            //$scope.saveNewContract = function(){
            //    console.log($scope.contract.typeId);
            //    new Promise(function(resolve,reject){
            //        $.ajax({
            //            method:'get',
            //            url:'/api/contract/nodeMember/'+$scope.contract.typeId,
            //            success:function(success){
            //                resolve(success);
            //            },
            //            error:function(err){
            //                console.log(err);
            //            }
            //        })
            //    }).then(function(success){
            //        var data = {
            //            "taskCardId":$scope.contract.taskId,
            //            "taskCardName":$scope.contract.taskCardName,
            //            "taskCardType":$scope.contract.type,
            //            "taskCardStartTime":$scope.contract.startTime,
            //            "taskCardEndTime":$scope.contract.endTime,
            //            "contractName":$scope.contract.name,
            //            "contractCode":$scope.contract.code,
            //            "totalMoney":$scope.contractMoney.total,
            //            "payType":'2-3-5',
            //            "paidMan":success.payLeader.name,
            //            "paidManId":success.payLeader.id,
            //            "partAName":$scope.partA.name,
            //            "partAPhone":$scope.partA.phone,
            //            "partAEmail":$scope.partA.email,
            //            "partALocation":$scope.partA.location,
            //            "partBId":$scope.partB.id,
            //            "partBName":$scope.partB.name,
            //            "partBPhone":$scope.partB.phone,
            //            "partBEmail":$scope.partB.email,
            //            "partBLocation":$scope.partB.address||'',
            //            "partBUserCardId":$scope.partB.userCardId||'',
            //            "partBGatheringCountName":$scope.partB.accountName,
            //            "partBGatheringCountNumber":$scope.partB.account,
            //            "contractStatus":'未发送',
            //            "creator":$scope.user.name,
            //            "creatorId":$scope.curUserId,
            //            "projectId":$scope.projectId
            //        };
            //        $.ajax({
            //            method:'post',
            //            data:data,
            //            url:'/api/contract/newContract',
            //            success:function(success){
            //                //console.log(success);
            //                $scope.cancelNewContract();
            //
            //                $scope.initContractNum($scope.Filter,$scope.curUserId,$scope.projectId);
            //            },
            //            error:function(err){
            //                console.log(err);
            //            }
            //        })
            //    });
            //
            //};

            /**
             * 翻页
             * @param type
             */
            $scope.turnToPage = function(type){
                var offset = -1;
                switch(type){
                    case "F":
                        offset=0;
                        $scope.currentPage=1;
                        break;
                    case "L":
                        offset=$scope.totalPage-1;
                        $scope.currentPage=$scope.totalPage;
                        break;
                    case "A":
                        $scope.currentPage<$scope.totalPage?offset=++$scope.currentPage-1:offset=-1;
                        break;
                    case "D":
                        $scope.currentPage>1?offset=--$scope.currentPage-1:offset=-1;
                        break;
                    default:
                        break;
                }
                //console.log("offset",offset);
                //console.log("cur",$scope.currentPage);
                //console.log("total",$scope.totalPage);

                if(offset!=-1){
                    $scope.initTable(offset,$scope.Filter,$scope.curUserId,$scope.projectId);
                }
            };

            /**
             * 翻页（跳页）
             * @param page
             */
            $scope.tunPageTo = function(page){
                $scope.pageListShow=false;
                $scope.currentPage=page;
                $scope.initTable(page-1,$scope.Filter,$scope.curUserId,$scope.projectId);
            };

            /**
             * 获取合同条数
             * @param filter 筛选条件
             * @param userid 用户ID
             * @param projectId 项目ID
             */
            $scope.initContractNum = function(filter,userid,projectId){
                var data={};
                //if(projectCommon.authority.manageAllContracts || projectCommon.authority.isProjectLeader){
                    data.contractStatus=filter;
                    data.projectId=projectId;
                //}else{
                //    data.contractStatus=filter;
                //    data.projectId=projectId;
                //    data.creator = userid;
                //}
                $.ajax({
                    method:'get',
                    url:'/api/contract/count',
                    data:data,
                    success:function(success){
                        $scope.$apply(function(){
                            $scope.contractNum = success;
                            $scope.totalPage = Math.ceil(parseInt($scope.contractNum)/10);
                            $scope.currentPage=1;
                        });
                        if($scope.contractNum!=0){
                            $('.contract-tableContain').show();
                            $('.noContract-page').hide();
                            $scope.initTable(0,filter,userid,projectId);
                        }else{
                            $('.contract-tableContain').hide();
                            $('.noContract-page').show();
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                });
            };

            /**
             * 获取合同列表数据
             * @param offset 跳过页数
             * @param filter 筛选条件
             * @param user userID
             * @param projectId
             */
            $scope.initTable = function(offset,filter,user,projectId){
                var data={};
                //if(projectCommon.authority.manageAllContracts || projectCommon.authority.isProjectLeader){
                    data.contractStatus=filter;
                    data.projectId=projectId;
                    data.offset = offset;
                //}else{
                //    data.offset = offset;
                //    data.contractStatus=filter;
                //    data.projectId=projectId;
                //    data.creator=user;
                //}
                $.ajax({
                    method:'get',
                    url:'/api/contract/getOnePageContractList',
                    data:data,
                    success:function(data){
                        console.log('111111111',data);
                        $scope.contractList=[];
                        var len = data.length;
                        var success = null;
                        var percent = null;
                        $scope.$apply(function(){
                            for(var i=0;i<len;i++){
                                success = data[i].lists;
                                percent = data[i].percent;
                                $scope.contractList.push({
                                    "contractCode":success.contractCode,
                                    "contractName":success.contractName,
                                    "crater":$scope.user.name,
                                    "payMan":success.paidMan,
                                    "partBName":success.partBName,
                                    "taskCardStartTime":success.taskCardStartTime,
                                    "taskCardEndTime":success.taskCardEndTime,
                                    "payJindu":$scope.getPercentOfPaid(success.paidPercent,success.payType),
                                    "taskJindu":percent,
                                    "contractStatus":success.contractStatus,
                                    "statusName":$scope.getStatusOfContract(success.contractStatus),
                                    "id":success.id
                                });
                            }
                        });
                    },
                    error:function(err){
                        console.log(err);
                    }

                })
            };

            /**
             * 点击查看合同
             * @param id
             */
            $scope.checkContract = function(id){
                localStorage.setItem('curContractId',id);
                //location.href = '#/myContractView';
                $state.go('view.contract');
                $scope.contractId = id;
            };


        }])
        .directive('test',function(){
            return {
                restrict:'E',
                replace:true,
                templateUrl:'./template/myContract/certificatesUploader.html'

            };
        })
        .config(function($stateProvider) {

            $stateProvider
                .state({
                    name: 'contractManagement',
                    url: '/contractManagement',
                    templateUrl:'./contractManagement.html'
                })
                .state({
                    name: 'view',
                    templateUrl: './template/myContract/view.html',
                    controller: 'viewCtrl'
                })
                .state({
                    name: 'task',
                    url: '/taskCard',
                    templateUrl: 'taskCard.edit.html',
                    //controller: 'viewCtrl'
                })
                .state({
                    name: 'view.contract',
                    url: '^myContractView',
                    templateUrl: './template/myContract/view-contract.html',
                    controller: 'contractCtrl'
                })
                .state({
                    name: 'view.supplement',
                    url: '^supplement',
                    templateUrl: './template/myContract/view-supplement.html',
                    controller: 'supplementCtrl'
                })
                .state({
                    name: 'view.voucher',
                    url: '^voucher',
                    templateUrl: './template/myContract/view-voucher.html',
                    controller: 'voucherCtrl'
                })
                .state({
                    name: 'view.contractLog',
                    url: '^contractLog',
                    templateUrl: './template/myContract/view-contractLog.html',
                    controller: 'contractLogCtrl'
                })
                .state({
                    name: 'contractEdit',
                    url: '/contractEdit',
                    templateUrl:'./template/myContract/contractEdit.html',
                    controller:'contractEditController'
                });
        })
        .constant('baseUrl', configInfo.server_url)
        .constant('backUrl', 'contractManagement');
}();
