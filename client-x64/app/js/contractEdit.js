/**
 * Created by hk60 on 2016/6/16.
 */
    !function(){
        angular.module('contractEdit', ['view', 'ui.router'])

            .controller('contractEditController',['$scope','$http','$rootScope','$state',function($scope,$http,$rootScope, $state) {
                $scope.projectId = localStorage.getItem('projectId');
                $scope.userId = localStorage.getItem('userId');
                $scope.contractId = localStorage.getItem('curContractId');
                $scope.EstepList =[];
                $scope.EContract = {};
                $scope.EtaskCardOptions=[];
                $scope.partAInfo = {};
                $scope.partBInfo = {};
                $scope.partB_checkE=null;
                $scope.company_showE=false;
                $scope.person_showE=false;
                $scope.companysE = [];
                $scope.personsE = [];
                $scope.searchSpanE = true;
                $scope.searchInput = '';
                $scope.projectNameE='';
                /**
                 * 获取项目信息
                 */
                $.ajax({
                    method:'get',
                    url:'/api/project/'+$scope.projectId,
                    success:function(success){
                        $scope.$apply(function(){
                            $scope.projectNameE = success.list.name;
                        })
                    },
                    error:function(err){
                        console.log(err);
                    }
                });
                /**
                 *`
                 */
                new Promise(function(resolve,reject){
                    $scope.EstepList =[];
                    $.ajax({
                        method:'post',
                        url:'/api/stepAsset/contractLeaderId',
                        data:{"contractLeaderId":$scope.userId,"projectId":$scope.projectId},
                        success:function(success){
                            //console.log(success);
                            var len = success.data.length;
                            for(;len>0;){
                                $scope.EstepList.push(success.data[--len].id);
                            }
                            resolve();
                        },
                        error:function(err){
                            reject(err);
                        }
                    })
                }).then(function(success){
                    $.ajax({
                        method:'post',
                        url:'/api/stepShot/contractLeaderId',
                        data:{"contractLeaderId":$scope.userId,"projectId":$scope.projectId},
                        success:function(success){
                            var len = success.data.length;
                            for(;len>0;){
                                $scope.EstepList.push(success.data[--len].id);
                            }
                            //console.log('waawa',$scope.EstepList);
                            $scope.getEditTasks($scope.EstepList);
                        },
                        error:function(err){
                            console.log(err);
                        }
                    })
                }).catch(function(data){
                    console.log(data);
                });

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
                }).
                then(function(success){
                    $scope.partAInfo.id =success[0].id;
                    $scope.partAInfo.name =success[0].name;
                    $scope.partAInfo.phone =success[0].phone;
                    $scope.partAInfo.email =success[0].email;
                    $scope.partAInfo.location =success[0].location;
                },function(err){
                    console.log(err);
                }).catch(function(data){
                    console.log(data);
                });
                new Promise(function(resolve,reject){
                    $.ajax({
                        method:'post',
                        url:'/api/user/getOuterUser',
                        success:function(success){
                            resolve(success);
                        },
                        error:function(err){
                            reject(err);
                        }
                    })
                }).then(function(success){
                    //console.log('ldahsdjkahsdkajkjkajkaadajsd',success);
                    $scope.$apply($scope.sysPartBInfoE(success));
                },function(err){
                    console.log(err);
                }).catch(function(data){
                    console.log(data);
                });


                departmentObj.bindLegalCheck([$('.contract-nameE'),$('.contract-codeE')],'100','-28','legal');
                departmentObj.bindLegalCheck([$('.contract-moneyE')],'100','-28','number');


                $scope.getEditTasks = function(nodeList){
                    var data = {};
                    data.contractId = $scope.contractId;
                    if(projectCommon.authority.isProjectLeader||projectCommon.authority.manageAllProjects||projectCommon.authority.manageAllContracts){
                        data.projectId = $scope.projectId;
                    }else{
                        data.list = nodeList;
                    }
                    $scope.EtaskCardOptions=[];
                    new Promise(function(resolve,reject){
                            $.ajax({
                                method:'get',
                                url:'/api/taskCard/getStepTasksInList',
                                data:data,
                                success:function(success){
                                    //console.log(success,'12312312312');
                                    var t_len = success.length;
                                    var v_len = 0;
                                    $scope.$apply(function(){
                                        if(t_len>0){
                                            for(var i=0;i<t_len;i++){
                                                v_len = success[i].TaskVersions.length;
                                                for(var v=0;v<v_len;v++){
                                                    $scope.EtaskCardOptions.push({
                                                        "Eid":success[i].TaskVersions[v].id,
                                                        "Ename":success[i].TaskVersions[v].name+'(v'+success[i].TaskVersions[v].version+')',
                                                        "EstartTime":success[i].TaskVersions[v].startDate.slice(0,10),
                                                        "EendTime":success[i].TaskVersions[v].planDate.slice(0,10),
                                                        "EmodelName":success[i].StepInfo.name,
                                                        "EmodelId":success[i].moduleId
                                                    });
                                                }
                                            }
                                        }
                                    });
                                    resolve();
                                },

                                error:function(err){
                                    console.log(err);
                                }
                            })

                    }).then(function(){
                        //console.log('wawawaww',$scope.EtaskCardOptions);
                        $scope.getEcontract();
                    }).catch(function(data){
                        console.log(data);
                    })
                };
                $scope.getEcontract = function(){
                    new Promise(function(resolve,reject){
                        $.ajax({
                            method:'get',
                            url:'/api/contract/getContractInfo/'+$scope.contractId,
                            success:function(success){
                                resolve(success);

                            },
                            error:function(err){
                                console.log(err);
                            }
                        })
                    }).then(function(success){
                        //console.log('1111122222222',success);
                        $scope.$apply(function(){
                            $scope.EContract={
                                id:success.contract.id,
                                name:success.contract.contractName,
                                code:success.contract.contractCode,
                                money:success.contract.totalMoney,
                                money1:$scope.getAPart(success.contract.totalMoney,0.2),
                                money2:$scope.getAPart(success.contract.totalMoney,0.3),
                                money3:success.contract.totalMoney-
                                $scope.getAPart(success.contract.totalMoney,0.2)-
                                $scope.getAPart(success.contract.totalMoney,0.3),
                                bName:success.contract.partBName,
                                bEmail:success.contract.partBEmail,
                                bCountName:success.contract.partBGatheringCountName,
                                bId:success.contract.partBId,
                                bLocation:success.contract.partBLocation,
                                bPhone:success.contract.partBPhone,
                                bCardId:success.contract.partBUserCardId,
                                bCountNum:success.contract.partBGatheringCountNumber,
                                task:$scope.EtaskCardOptions[$scope.getTask(success.task.versionId)],
                                type:success.contract.taskCardType,
                                start:success.contract.taskCardStartTime,
                                end:success.contract.taskCardEndTime
                            };

                            //console.log($scope.EContract);
                        });
                    }).catch(function(data){
                        console.log(data);
                    });
                };

                $scope.getAPart =  function(money,percent){
                    return Math.round(parseInt(money)*percent);
                };
                $scope.getTask = function(taskId){
                    //console.log(taskId,'aaaaaaaaaaaaa');
                    var len = $scope.EtaskCardOptions.length;
                    //console.log(len,'lenleneleneenmee');
                    for(;len>0;){
                        if($scope.EtaskCardOptions[--len].Eid==taskId){
                            return len;
                        }
                    }
                };
                $scope.changeOptions = function(){
                    //console.log('see the task',$scope.EContract.task);
                    $scope.EContract.type=$scope.EContract.task.EmodelName;
                    $scope.EContract.start=$scope.EContract.task.EstartTime;
                    $scope.EContract.end=$scope.EContract.task.EendTime;
                };

                $scope.updateContractChangesE = function(){
                    //console.log($scope.EContract);
                    new Promise(function(resolve,reject){
                        $.ajax({
                            method:'get',
                            url:'/api/contract/nodeMember/'+$scope.EContract.task.EmodelId,
                            success:function(success){
                                resolve(success);
                            },
                            error:function(err){
                                console.log(err);
                            }
                        })
                    }).then(function(success){
                        var data = {
                            "taskCardVersionId":$scope.EContract.task.Eid,
                            "taskCardName":$scope.EContract.task.Ename,
                            "taskCardType":$scope.EContract.type,
                            "taskCardStartTime":$scope.EContract.start,
                            "taskCardEndTime":$scope.EContract.end,
                            "contractName":$scope.EContract.name,
                            "contractCode":$scope.EContract.code,
                            "totalMoney":$scope.EContract.money,
                            "paidMan":success.payLeader.name,
                            "partBId":$scope.EContract.bId,
                            "partBName":$scope.EContract.bName,
                            "partBPhone":$scope.EContract.bPhone,
                            "partBEmail":$scope.EContract.bEmail,
                            "partBLocation":$scope.EContract.bLocation||'',
                            "partBUserCardId":$scope.EContract.bCardId||'',
                            "partBGatheringCountName":$scope.EContract.bCountName,
                            "partBGatheringCountNumber":$scope.EContract.bCountNum
                        };
                        $.ajax({
                            method:'put',
                            data:data,
                            url:'/api/contract/'+$scope.EContract.id,
                            success:function(success){
                                console.log('1111',success);
                                //$scope.initContractNumE($rootScope.curFilter,$scope.userId,$scope.projectId);
                                location.href='#/myContractView';
                                $state.go('view.contract')
                            },
                            error:function(err){
                                console.log(err);
                            }
                        })
                    });
                };
                $scope.cancelUpdateE = function(){
                    $state.go('view.contract');
                };

                //=========================================================================================
                $scope.cancelCheckPartBE = function(){
                    $('.checkPartB-contain').hide();
                };
                $scope.showPartBE = function(){
                    $('.checkPartB-contain').show();
                };
                $scope.checkThisAsPartBE = function($event,data){
                    //console.log(data);
                    $scope.partB_checkE = data;
                    $('.partB-list i').html('&#xe63f;');
                    $event.target.innerHTML = '&#xe68e;';
                };
                $scope.saveCheckPartBE = function(){
                    //console.log($scope.partB_checkE,'12312312312');
                    $scope.EContract.bId = $scope.partB_checkE.id;
                    $scope.EContract.bLocation = $scope.partB_checkE.address || '';
                    $scope.EContract.bPhone = $scope.partB_checkE.phone;
                    $scope.EContract.bCardId = $scope.partB_checkE.userCardId || '';
                    $scope.EContract.bCountNum = $scope.partB_checkE.account;
                    $scope.EContract.bName = $scope.partB_checkE.name;
                    $scope.EContract.bEmail = $scope.partB_checkE.email;
                    $scope.EContract.bCountName = $scope.partB_checkE.accountName;
                    $('.checkPartB-contain').hide();
                };
                $scope.checkThisAsPartB = function($event,data){
                    //console.log(data);
                    $scope.partB_checkE = data;
                    $('.partB-list i').html('&#xe63f;');
                    $event.target.innerHTML = '&#xe68e;';
                };
                $scope.showPartBListE = function(type){
                    if(type=='company'){
                        if($scope.company_showE){
                            $scope.company_showE=false;
                            $('.partB-company div i').html('&#xe67a;');
                        }else{
                            $('.partB-company div i').html('&#xe67b;');
                            $('.partB-person div i').html('&#xe67a;');
                            $scope.company_showE=true;
                            $scope.person_showE=false;
                        }

                    }else{
                        if($scope.person_showE){
                            $scope.person_showE=false;
                            $('.partB-person div i').html('&#xe67a;');
                        }else{
                            $('.partB-company div i').html('&#xe67a;');
                            $('.partB-person div i').html('&#xe67b;');
                            $scope.company_showE=false;
                            $scope.person_showE=true;
                        }
                    }
                };
                $scope.sysPartBInfoE = function(success){
                    $scope.personsE=[];
                    $scope.companysE=[];
                    var len = success.length;
                    for(var i=len;i>0;i--){
                        if(success[i-1].Role.name=='签约方'){
                            if(success[i-1].userType==1){
                                $scope.personsE.push({
                                    "id":success[i-1].id,
                                    "name":success[i-1].name,
                                    "companyName":success[i-1].companyName,
                                    "phone":success[i-1].phone,
                                    "email":success[i-1].email,
                                    "userCardId":success[i-1].userCardId,
                                    "accountName":success[i-1].accountName,
                                    "account":success[i-1].account,
                                    "src":configInfo.server_url+'/'+success[i-1].image,
                                    "type":success[i-1].userType
                                })
                            }else{
                                $scope.companysE.push({
                                    "id":success[i-1].id,
                                    "name":success[i-1].name,
                                    "companyName":success[i-1].companyName,
                                    "phone":success[i-1].phone,
                                    "email":success[i-1].email,
                                    "address":success[i-1].address,
                                    "accountName":success[i-1].accountName,
                                    "account":success[i-1].account,
                                    "src":configInfo.server_url+'/'+success[i-1].image,
                                    "type":success[i-1].userType
                                })
                            }
                        }
                    }
                };
                $scope.transportClickE = function($event){
                    //console.log($event);
                    if($event.target.tagName=='I'){
                        $event.target.offsetParent.previousElementSibling.focus();
                    }else if($event.target.tagName=='SPAN'){
                        $event.target.previousElementSibling.focus();
                    }
                    //$event.target.previousElementSibling.focus();
                };
                $scope.searchInputFuncE = function(){
                    if($scope.searchInput==''){
                        $scope.searchSpanE=true;
                    }else{
                        $scope.searchSpanE=false;
                    }
                    // console.log($scope.searchInput);
                    new Promise(function(resolve,reject){
                        $.ajax({
                            method:'post',
                            url:'/api/user/selectOuterUser',
                            data:{"name":$scope.searchInput},
                            success:function(success){
                                resolve(success);
                            },
                            error:function(err){
                                reject(err);
                            }
                        })
                    }).then(function(success){
                        //TODO
                        //console.log('aaaaaaaaaaa',success);
                        $scope.$apply($scope.sysPartBInfoE(success));
                    },function(err){
                        console.log(err);
                    }).catch(function(data){
                        console.log(data);
                    });

                };


                /*$scope.initContractNumE = function(filter,userid,projectId){
                 $.ajax({
                 method:'get',
                 url:'/api/contract/count',
                 data:{"contractStatus":filter,"creator":userid,"projectId":projectId},
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
                 $scope.initTableE = function(offset,filter,user,projectId){
                 $.ajax({
                 method:'get',
                 url:'/api/contract/getOnePageContractList',
                 data:{"offset":offset,"contractStatus":filter,"creator":user,"projectId":projectId},
                 success:function(success){
                 console.log('111111111',success);
                 $scope.$apply(function(){
                 var len = success.length;
                 $scope.contractList=[];
                 for(var i=0;i<len;i++){
                 $scope.contractList.push({
                 "contractCode":success[i].contractCode,
                 "contractName":success[i].contractName,
                 "crater":$scope.user.name,
                 "payMan":success[i].paidMan,
                 "partBName":success[i].partBName,
                 "taskCardStartTime":success[i].taskCardStartTime,
                 "taskCardEndTime":success[i].taskCardEndTime,
                 "payJindu":success[i].paidPercent,
                 "taskJindu":"",
                 "contractStatus":success[i].contractStatus,
                 "id":success[i].id
                 });
                 }
                 });
                 },
                 error:function(err){
                 console.log(err);
                 }

                 })
                 };*/
                //=========================================================================================
            }])
            .constant('baseUrl', configInfo.server_url);
    }();
