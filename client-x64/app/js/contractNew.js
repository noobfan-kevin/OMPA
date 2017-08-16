/**
 * Created by hk60 on 2016/6/16.
 */
    !function(){
        angular.module('contractNew', ['view', 'ui.router','contractManagement'])

            .controller('contractNewController',['$scope','$http','$rootScope',function($scope,$http,$rootScope) {
                $scope.curUserIdN = localStorage.getItem("userId");
                $scope.projectIdN = localStorage.getItem("projectId");
                $scope.curTaskId = localStorage.getItem("thisTaskVersionId");
                $scope.projectNameN = '';
                $scope.userN = null;
                $scope.contractN = {"name":'', "code":'', "type":'',"typeId":'', "taskCard":'', startTime:'', endTime:'',taskId:'',taskCardName:''};
                $scope.partA = {"id":'',"name":'', "phone":'', "email":'', "location":''};
                $scope.partB = {id:'',"name":'',phone:'',email:'',address:'',userCardId:'',accountName:'',account:''};
                $scope.taskCardOptions = [{"name":"", "id":"", "startTime":'', "endTime":'', "modelName":'',"modelId":''}];
                $scope.company_show = false;
                $scope.person_show = false;
                $scope.userType_show = true;
                $scope.partB_check = null;
                $scope.searchInput = '';
                $scope.searchSpan = true;
                $scope.companys =[];
                $scope.persons = [];
                $scope.contractMoney = {"total":'', "first":0, "second":0, "third":0};
                var stepList = [];

                /**
                 * 获取项目信息
                 */
                $.ajax({
                    method:'get',
                    url:'/api/project/'+$scope.projectIdN,
                    success:function(success){
                        $scope.$apply(function(){
                            $scope.projectNameN = success.list.name;
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
                    url:'/api/user/'+$scope.curUserIdN,
                    success:function(success){
                        $scope.$apply(function(){
                            $scope.userN = success;
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
                 * 获取乙方信息
                 */
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
                    $scope.sysPartBInfo(success);
                },function(err){
                    console.log(err);
                }).catch(function(data){
                    console.log(data);
                });

                /**
                 * 通过项目ID和用户ID获取用户所负责的节点集合
                 */
                new Promise(function(resolve,reject){
                    stepList=[];
                    //console.log($scope.curUserIdN);
                    $.ajax({
                        method:'post',
                        url:'/api/stepAsset/contractLeaderId',
                        data:{"contractLeaderId":$scope.curUserIdN,"projectId":$scope.projectIdN},
                        success:function(success){
                            //console.log(success);
                            var len = success.data.length;
                            for(;len>0;){
                                stepList.push(success.data[--len].id);
                            }
                            resolve();
                        },
                        error:function(err){
                            reject(err);
                        }
                    })
                })
                    .then(function(success){
                        $.ajax({
                            method:'post',
                            url:'/api/stepShot/contractLeaderId',
                            data:{"contractLeaderId":$scope.curUserIdN,"projectId":$scope.projectIdN},
                            success:function(success){
                                var len = success.data.length;
                                for(;len>0;){
                                    stepList.push(success.data[--len].id);
                                }
                                //console.log(stepList);
                                $scope.getTasks(stepList);
                            },
                            error:function(err){
                                console.log(err);
                            }
                        })
                    })
                    .catch(function(data){
                        console.log(data);
                    });
                /**
                 * 新建合同部分 输入验证绑定
                 */
                departmentObj.bindLegalCheck([$('.contract-name'),$('.contract-code')],'100','-28','ng-model');
                departmentObj.bindLegalCheck([$('.contract-money')],'100','-28','number');


                $scope.getTasks = function(nodeList){
                        var data = {};
                        if(projectCommon.authority.isProjectLeader||projectCommon.authority.manageAllProjects||projectCommon.authority.manageAllContracts){
                            data.projectId = $scope.projectIdN;
                        }else{
                            data.list = nodeList;
                        }
                        $scope.taskCardOptions=[];
                        new Promise(function(resolve,reject){
                            $.ajax({
                                method:'get',
                                url:'/api/taskCard/getStepTasksInList',
                                data:data,
                                success:function(success){
                                    //console.log(success,'taskaklsdjaklsjdjklasn');
                                    var t_len = success.length;
                                    var v_len = 0;
                                    if(t_len>0){
                                        $scope.$apply(function(){
                                            for(var i=0;i<t_len;i++){
                                                v_len = success[i].TaskVersions.length;
                                                for(var v=0;v<v_len;v++){
                                                    $scope.taskCardOptions.push({
                                                        "id":success[i].TaskVersions[v].id,
                                                        "name":success[i].TaskVersions[v].name+'(v'+success[i].TaskVersions[v].version+')',
                                                        "startTime":success[i].TaskVersions[v].startDate.slice(0,10),
                                                        "endTime":success[i].TaskVersions[v].planDate.slice(0,10),
                                                        "modelName":success[i].StepInfo.name,
                                                        "modelId":success[i].moduleId
                                                    });
                                                }

                                            }

                                        });
                                    }
                                    resolve();
                                },
                                error:function(err){
                                    console.log(err);
                                }
                            })

                        }).then(function(){
                            if(localStorage.getItem('newContractFrom')=='task'){
                                //console.log($scope.curTaskId,'111111111111111111');
                                $scope.$apply(
                                    function(){
                                        $scope.contractN.taskCard = $scope.taskCardOptions[$scope.getTaskPosition($scope.curTaskId)];
                                        $scope.contractN.startTime = $scope.contractN.taskCard.startTime;
                                        $scope.contractN.endTime = $scope.contractN.taskCard.endTime;
                                        $scope.contractN.type = $scope.contractN.taskCard.modelName;
                                        $scope.contractN.typeId = $scope.contractN.taskCard.modelId;
                                        $scope.contractN.taskId = $scope.contractN.taskCard.id;
                                        $scope.contractN.taskCardName = $scope.contractN.taskCard.name;
                                    }
                                );
                            }
                        })

                };

                /**
                 * 任务卡select
                 */
                $scope.showTheOption = function(){
                    //console.log('------------------',$scope.contractN.taskCard);
                    $scope.contractN.startTime = $scope.contractN.taskCard.startTime;
                    $scope.contractN.endTime = $scope.contractN.taskCard.endTime;
                    $scope.contractN.type = $scope.contractN.taskCard.modelName;
                    $scope.contractN.typeId = $scope.contractN.taskCard.modelId;
                    $scope.contractN.taskId = $scope.contractN.taskCard.id;
                    $scope.contractN.taskCardName = $scope.contractN.taskCard.name;
                };

                /**
                 * 新建合同-输入金额后获取步骤金额
                 */
                $scope.getThreeStepsMoney = function(){
                    $scope.contractMoney.first =  Math.round($scope.contractMoney.total*0.2);
                    $scope.contractMoney.second =  Math.round($scope.contractMoney.total*0.3);
                    $scope.contractMoney.third = $scope.contractMoney.total-$scope.contractMoney.first-$scope.contractMoney.second;

                };

                /**
                 * 选择乙方界面
                 */
                $scope.showPartB = function(){
                    $('.checkPartB-contain').show();
                };

                /**
                 * 乙方选择界面-取消
                 */
                $scope.cancelCheckPartB = function(){
                    $('.checkPartB-contain').hide();
                };

                /**
                 * 乙方选择界面-确定
                 */
                $scope.saveCheckPartB = function(){
                    //TODO 临时选择的变量里面数据传递到PartB的MODEL里面
                    //$scope.partB_check.id;
                    $scope.partB=$scope.partB_check;
                    if($scope.partB_check.type==1){
                        $scope.userType_show = false;
                    }else{
                        $scope.userType_show = true;
                    }
                    $('.checkPartB-contain').hide();
                };

                /**
                 * 乙方选择界面-搜索
                 */
                $scope.searchInputFunc = function(){
                    if($scope.searchInput==''){
                        $scope.searchSpan=true;
                    }else{
                        $scope.searchSpan=false;
                    }
                    //console.log($scope.searchInput);
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
                        $scope.$apply($scope.sysPartBInfo(success));
                    },function(err){
                        console.log(err);
                    }).catch(function(data){
                        console.log(data);
                    });

                };

                /**
                 * 获取乙方信息后，分类个人或公司
                 * @param success
                 */
                $scope.sysPartBInfo = function(success){
                    $scope.persons=[];
                    $scope.companys=[];
                    var len = success.length;
                    for(var i=len;i>0;i--){
                        if(success[i-1].Role.name=='签约方'){
                            if(success[i-1].userType==1){
                                $scope.persons.push({
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
                                $scope.companys.push({
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

                /**
                 * 处理覆盖input造成的无法获取焦点
                 * @param $event
                 */
                $scope.transportClick = function($event){
                    //console.log($event);
                    if($event.target.tagName=='I'){
                        $event.target.offsetParent.previousElementSibling.focus();
                    }else if($event.target.tagName=='SPAN'){
                        $event.target.previousElementSibling.focus();
                    }
                    //$event.target.previousElementSibling.focus();
                };

                /**
                 * 选择乙方界面，点击切换显示个人或者公司
                 * @param type
                 */
                $scope.showPartBList = function(type){
                    if(type=='company'){
                        if($scope.company_show){
                            $scope.company_show=false;
                            $('.partB-company div i').html('&#xe67a;');
                        }else{
                            $('.partB-company div i').html('&#xe67b;');
                            $('.partB-person div i').html('&#xe67a;');
                            $scope.company_show=true;
                            $scope.person_show=false;
                        }

                    }else{
                        if($scope.person_show){
                            $scope.person_show=false;
                            $('.partB-person div i').html('&#xe67a;');
                        }else{
                            $('.partB-company div i').html('&#xe67a;');
                            $('.partB-person div i').html('&#xe67b;');
                            $scope.company_show=false;
                            $scope.person_show=true;
                        }
                    }
                };

                /**
                 * 点击选择一个乙方
                 * @param $event
                 * @param data
                 */
                $scope.checkThisAsPartB = function($event,data){
                    //console.log(data);
                    $scope.partB_check = data;
                    $('.partB-list i').html('&#xe63f;');
                    $event.target.innerHTML = '&#xe68e;';
                };

                /**
                 * 取消新建合同
                 */
                $scope.cancelNewContract = function(){
                    $scope.contractN = {name:'', code:'', type:'', taskCard:'', startTime:'', endTime:'',taskId:''};
                    $scope.contractMoney = {"total":'', "first":0, "second":0, "third":0};
                    $scope.partB={id:'',name:'',phone:'',email:'',address:'',userCardId:'',accountName:'',account:''};
                    $scope.taskCardOptions={};
                    location.href = '#/contractManagement';
                };

                /**
                 * 新建合同
                 */
                $scope.saveNewContract = function(){
                    //console.log($scope.contractN.typeId);
                    //console.log($scope.contractN);
                    //console.log($scope.partB,'1111111');
                    if($scope.contractN.name==''){
                        projectCommon.quoteUserWarning2('.contracts-new','50%','40px','请填写合同名称');
                    }else if($scope.contractN.code==''){
                        projectCommon.quoteUserWarning2('.contracts-new','50%','40px','请填写合同编码');
                    }else if($scope.contractN.taskCardName==''){
                        projectCommon.quoteUserWarning2('.contracts-new','50%','40px','请选择任务卡');
                    }else if($scope.contractMoney.total==''){
                        projectCommon.quoteUserWarning2('.contracts-new','50%','40px','请填写合同金额');
                    }else if($scope.partB.name==''){
                        projectCommon.quoteUserWarning2('.contracts-new','50%','40px','请选择乙方');
                    }else if($scope.partB.phone==''){
                        projectCommon.quoteUserWarning2('.contracts-new','40%','40px','请联系管理员完善乙方电话信息');
                    }else if($scope.partB.email==''){
                        projectCommon.quoteUserWarning2('.contracts-new','40%','40px','请联系管理员完善乙方邮箱信息');
                    }else{
                        new Promise(function(resolve,reject){
                            $.ajax({
                                method:'get',
                                url:'/api/contract/nodeMember/'+$scope.contractN.typeId,
                                success:function(success){
                                    resolve(success);
                                },
                                error:function(err){
                                    console.log(err);
                                }
                            })
                        }).then(function(success){
                            //console.log(success,'12312312312',$scope.contractN);
                            var data = {
                                "taskCardVersionId":$scope.contractN.taskId,
                                "taskCardName":$scope.contractN.taskCardName,
                                "taskCardType":$scope.contractN.type,
                                "taskCardStartTime":$scope.contractN.startTime,
                                "taskCardEndTime":$scope.contractN.endTime,
                                "contractName":$scope.contractN.name,
                                "contractCode":$scope.contractN.code,
                                "totalMoney":$scope.contractMoney.total,
                                "payType":'2-3-5',
                                "paidMan":success.payLeader.name,
                                "paidManId":success.payLeader.id,
                                "contractLeaderId":success.contractLeader.id,
                                "partAName":$scope.partA.name,
                                "partAPhone":$scope.partA.phone,
                                "partAEmail":$scope.partA.email,
                                "partALocation":$scope.partA.location,
                                "partBId":$scope.partB.id,
                                "partBName":$scope.partB.name,
                                "partBPhone":$scope.partB.phone,
                                "partBEmail":$scope.partB.email,
                                "partBLocation":$scope.partB.address||'',
                                "partBUserCardId":$scope.partB.userCardId||'',
                                "partBGatheringCountName":$scope.partB.accountName,
                                "partBGatheringCountNumber":$scope.partB.account,
                                "contractStatus":'1',
                                "read":'',
                                "creator":$scope.userN.name,
                                "creatorId":$scope.curUserIdN,
                                "projectId":$scope.projectIdN
                            };
                            //console.log(data,'1111111111111');
                            $.ajax({
                                method:'post',
                                data:data,
                                url:'/api/contract/newContract',
                                success:function(success){
                                    //console.log(success);
                                    $scope.cancelNewContract();
                                    //location.href = '#/contractManagement';
                                },
                                error:function(err){
                                    console.log(err);
                                }
                            })
                        });
                    }

                };


                $scope.changeTaskStatus = function(id){
                    $.ajax({
                        url: '/api/taskCard/updateTaskStatus',
                        type: 'put',
                        data:{
                            status:2,  //制作中
                            versionId:id,
                            userId:localStorage.getItem('userId'),
                            readStatus:'false'
                        },
                        success: function (data){
                            //console.log('---派发完成---------',data);
                            //只有由我发送里面有派发按钮
                            taskBasicInfo.countAllOfMyTaskUnread();//刷新任务小红点
                        },
                        error: function(data){
                            //警告！
                            //projectCommon.quoteUserWarning('#taskSend','449px','261px','派发失败！');
                            console.log(data);
                        }
                    });
                };
                $scope.getTaskPosition = function(taskId){
                    //console.log(taskId,'aaaaaaaaaaaaa');
                    var len = $scope.taskCardOptions.length;
                    //console.log(len,'lenleneleneenmee');
                    for(;len>0;){
                        if($scope.taskCardOptions[--len].id==taskId){
                            return len;
                        }
                    }
                };
                //=========================================================================================
            }])
            .config(function($stateProvider) {

                $stateProvider
                    .state({
                        name: 'contractNew',
                        url: '/contractNew',
                        templateUrl:'./template/myContract/newContract.html',
                        controller:'contractNewController'
                    })
            })
            .constant('baseUrl', configInfo.server_url);
    }();
