/**
 * Created by hk053 on 2016/5/13.
 */
    !function($,operationTaskLog){
        var operationTaskLog= angular.module('operationTaskLog',[]);
        operationTaskLog.controller('OperationTaskLog',function($scope,$http){
            $scope.operationTaskLogs=1;
            $scope.operationTaskCurPage=1;
            $scope.operationTaskPages=1;
            $scope.operationTaskPageList = [];
            $scope.operationUl = false;
            $scope.versionId=localStorage.getItem('thisTaskVersionId');
            $scope.newLine = function(str){
                return str.split('\r\n');
            };


            angular.element('body').eq(0)[0].onclick = function(e){
                var target = $(e.target);
                if(target.hasClass('curTask-page-choose')){
                }else if(target.parent().hasClass('curTask-page-choose')){
                }else if(target.hasClass('curTask-page')){
                }else{
                    $scope.$apply($scope.operationUl = false);
                }
            };
            $scope.initData = function(offset,versionId){
                //console.log('here',versionId);
                new Promise(function(resolve,reject){
                    $.ajax({
                        method:'get',
                        url:'/api/log/count',
                        data:{versionId:versionId},
                        success:function(success){
                            $scope.$apply(function(){
                                    $scope.operationTaskLogs = success;
                                    $scope.operationTaskPages = Math.ceil(success/10);
                                    $scope.operationTaskCurPage = 1;
                                    var data = [];
                                    for(var i=0;i<$scope.operationTaskPages;i++){
                                        data.push({
                                            page:i+1,
                                            offset:i
                                        })
                                    }
                                    $scope.operationTaskPageList=data;
                                }
                            );
                            resolve();
                        },
                        error:function(err){
                            console.log(err);
                        }
                    });
                }).then(function(){
                    myCreateTask.ajaxCommon('get','/api/log/logList',function(data){
                        //console.log(data,'12u73jhdgas');
                        var len = data.length;
                        var array =[];
                        for(var i=0;i<len;i++){
                            array.push({
                                person:data[i].userName,
                                time:data[i].time.slice(0,10),
                                detail: $scope.newLine(data[i].description)
                            })
                        }
                        $scope.$apply($scope.opeartionTasklogs = array);
                        //console.log(array,'duadas');
                    },{offset:offset,versionId:versionId});
                }).catch(function(err){
                    console.log(err);
                });
            };

            $scope.getDateUnderVersion = function(offset){
                myCreateTask.ajaxCommon('get','/api/log/logList',function(data){
                    var len = data.length;
                    var array =[];
                    for(var i=0;i<len;i++){
                        array.push({
                            person:data[i].userName,
                            time:data[i].time.slice(0,10),
                            detail: $scope.newLine(data[i].description)
                        })
                    }
                    $scope.$apply($scope.opeartionTasklogs = array);
                },{offset:offset,versionId:$scope.versionId});
            };
            $scope.changePages = function(info){
                switch (info){
                    case 'first':
                        if($scope.operationTaskCurPage != 1){
                            $scope.operationTaskCurPage = 1;
                            $scope.getDateUnderVersion(0);
                        }
                        break;
                    case 'last':
                        if($scope.operationTaskCurPage != $scope.operationTaskPages){
                            $scope.operationTaskCurPage = $scope.operationTaskPages;
                            $scope.getDateUnderVersion($scope.operationTaskPages-1);
                        }
                        break;
                    case 'next':
                        if($scope.operationTaskCurPage != $scope.operationTaskPages){
                            $scope.getDateUnderVersion($scope.operationTaskCurPage);
                            $scope.operationTaskCurPage += 1;
                        }
                        break;
                    case 'prev':
                        if($scope.operationTaskCurPage != 1){
                            $scope.operationTaskCurPage -= 1;
                            $scope.getDateUnderVersion($scope.operationTaskCurPage-1);
                        }
                        break;
                    default:
                        if($scope.operationTaskCurPage != info+1){
                            $scope.operationTaskCurPage = info+1;
                            $scope.getDateUnderVersion(info);
                        }
                        break;
                }
            };

            $scope.showPagesChoose = function(){
                $scope.operationUl = !$scope.operationUl;
            };

        });
    }(jQuery,window);