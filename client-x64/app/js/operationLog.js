/**
 * Created by hk60 on 2016/5/12.
 */

angular.module('operationLogApp',[]).controller('OperationLog',['$scope','$http',function($scope,$http){
    var projectId = localStorage.getItem('projectId');
    $scope.curPosition=null;
    $scope.operationLogs = 1;
    $scope.operationPages = 0;
    $scope.operationPageList = [];
    $scope.operationCurPage = 1;
    $scope.opeartionlogs = [];
    $scope.choosePage = false;
    $scope.keyWords = '';
    $.ajax({
        method:'get',
        url:'/api/project/'+projectId,
        success:function(data){
            $scope.curPosition = data.list.name;
        },
        error:function(err){
            console.log(err);
        }
    });

    $.ajax({
        method:'get',
        url:'/api/log/count',
        data:{projectId:projectId},
        success:function(success){
            $scope.$apply(function(){
                $scope.operationLogs = success;
                $scope.operationPages = Math.ceil(success/10);
                $scope.operationCurPage = 1;
                var data = [];
                for(var i=0;i<$scope.operationPages;i++){
                    data.push({
                        page:i+1,
                        offset:i
                    })
                }
                $scope.operationPageList=data;
            }
            );
        },
        error:function(err){
            console.log(err);
        }
    });

    $.ajax({
        method:'get',
        url:'/api/log/logList',
        data:{offset:0,projectId:projectId},
        success:function(success){
            console.log(success);
            var len = success.length;
            var data =[];
            for(var i=0;i<len;i++){
                data.push({
                    person:success[i].userName,
                    time:success[i].time.slice(0,10),
                    detail:$scope.newLine(success[i].description)
                })
            }
            $scope.$apply($scope.opeartionlogs = data);
        },
        error:function(err){
            console.log(err);
        }
    });


   $('body').off('click.ompa').on('click.ompa',function(e){
        var target = $(e.target);
        if(target.hasClass('curLog-page-choose')){
        }else if(target.parent().hasClass('curLog-page-choose')){
        }else if(target.hasClass('cur-page')){
        }else{
            $scope.$apply($scope.choosePage = false);
        }
    });
    $scope.newLine = function(str){
       return str.split('\r\n');
    };
    $scope.changePage = function(info){
        switch (info){
            case 'first':
                if($scope.operationCurPage != 1){
                    $scope.operationCurPage = 1;
                    $scope.getOnePageLogList(0);
                }
                break;
            case 'last':
                if($scope.operationCurPage != $scope.operationPages){
                    $scope.operationCurPage = $scope.operationPages;
                    $scope.getOnePageLogList($scope.operationPages-1);
                }
                break;
            case 'next':
                if($scope.operationCurPage != $scope.operationPages){
                    $scope.getOnePageLogList($scope.operationCurPage);
                    $scope.operationCurPage += 1;
                }
                break;
            case 'prev':
                if($scope.operationCurPage != 1){
                    $scope.operationCurPage -= 1;
                    $scope.getOnePageLogList($scope.operationCurPage-1);
                }
                break;
            default:
                if($scope.operationCurPage != info+1){
                    $scope.operationCurPage = info+1;
                    $scope.getOnePageLogList(info);
                }
                break;
        }
    };

    $scope.getOnePageLogList = function(offset){
        $.ajax({
            method:'get',
            url:'/api/log/logList',
            data:{offset:offset,where:{projectId:projectId}},
            success:function(success){
                //console.log(success);
                var len = success.length;
                var data =[];
                for(var i=0;i<len;i++){
                    data.push({
                        person:success[i].userName,
                        time:success[i].time.slice(0,10),
                        detail:$scope.newLine(success[i].description)
                    })
                }
                $scope.$apply($scope.opeartionlogs = data);
            },
            error:function(err){
                console.log(err);
            }
        })
    };
    $scope.showPageChoose = function(){
        $scope.choosePage = !$scope.choosePage;
    };
    $scope.logKeyWords = function() {
        new Promise(function(resolve,reject){
            $.ajax({
                method:'get',
                url:'/api/log/count',
                data:{projectId:projectId,like:$scope.keyWords},
                success:function(success){
                    $scope.$apply(function(){
                            $scope.operationLogs = success;
                            $scope.operationPages = Math.ceil(success/10);
                            $scope.operationCurPage = 1;
                            var data = [];
                            for(var i=0;i<$scope.operationPages;i++){
                                data.push({
                                    page:i+1,
                                    offset:i
                                })
                            }
                            $scope.operationPageList=data;

                        }
                    );
                    resolve();
                },
                error:function(err){
                    console.log(err);
                }
            });
        }).then(function(){
            $.ajax({
                method: 'get',
                url: '/api/log/logList',
                data: {offset: 0, where: {projectId: projectId}, like: $scope.keyWords},
                success: function (success) {
                    //console.log(success);
                    var len = success.length;
                    var data = [];
                    for (var i = 0; i < len; i++) {
                        data.push({
                            person: success[i].userName,
                            time: success[i].time.slice(0, 10),
                            detail: $scope.newLine(success[i].description)
                        })
                    }
                    $scope.$apply($scope.opeartionlogs = data);
                },
                error: function (err) {
                    console.log(err);
                }
            })
        }).catch(function(err){
            console.log(err);
        });
    }
}]);

