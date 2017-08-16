/**
 * Created by hk61 on 2016/6/3.
 */

(function() {
    'use strict';

    var ng = angular;
    var baseTpl = './template/myContract/';
    // 设置模板路径
    function setPath(src) {
        return baseTpl + src;
    }

    ng.module('myContract', ['ui.router', 'view', 'contractEdit']);

/*============================================== 配置 ================================================================*/
    routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state({
                name: 'main',
                url: '/myContractList',
                templateUrl: setPath('list-page.html')
            })
            .state({
                name: 'task',
                url: '/taskCard',
                templateUrl: 'taskCard.edit.html',
                //controller: 'viewCtrl'
            })
            .state({
                name: 'view',
                templateUrl: setPath('view.html'),
                controller: 'viewCtrl'
            })
            .state({
                name: 'view.contract',
                url: '^myContractView',
                templateUrl: setPath('view-contract.html'),
                controller: 'contractCtrl'
            })
            .state({
                name: 'view.supplement',
                url: '^supplement',
                templateUrl: setPath('view-supplement.html'),
                controller: 'supplementCtrl'
            })
            .state({
                name: 'view.voucher',
                url: '^voucher',
                templateUrl: setPath('view-voucher.html'),
                controller: 'voucherCtrl'
            })
            .state({
                name: 'contractEdit',
                url: '/contractEdit',
                templateUrl:'./template/myContract/contractEdit.html',
                controller:'contractEditController'
            });
    }

    ng.module('myContract')
      .config(routerConfig)
      .config(['$httpProvider', function ($httpProvider) {
          $httpProvider.defaults.headers.common['sid'] = localStorage.getItem('sid');
          $httpProvider.defaults.headers.common['userId'] = localStorage.getItem('userId');
      }])
      .constant('baseUrl', configInfo.server_url)
      .constant('backUrl', 'myContractList');


/*============================================== 服务 =================================================================*/
    pageFactory.$inject = ['baseUrl', '$http'];
    function pageFactory(baseUrl, $http) {
        return {
            filter: function (args) {
                return $http({
                    method: 'post',
                    url: baseUrl + '/api/contract/filterByUser',
                    data: {
                        "page": args.page || 0,
                        "status": args.status || [],
                        "type": args.type || 'send',
                        "userId": localStorage.getItem('userId')
                    }
                })
            },
            changeStatus: function (params) {
                return $http({
                    method: 'put',
                    url: baseUrl + '/api/contract/status/' + localStorage.getItem('curContractId'),
                    data: params
                }).success(function (req) {
                    return req.data;
                })
            }
        };
    }

    function computeProgressFactory() {
        return function (progress) {
            var finished = 0;
            var progressDone = 0;

            if (!progress.length) return "0%";

            progress.forEach(function (prog) {
                if (prog.status == 1) {
                    progressDone += 1;
                    finished += parseInt(prog.percent)
                }
            });
            return finished == 0 ? '0%' : finished + '%';
        }
    }

    function redDotFactory() {
        // obj == dbContract;
        return function (obj) {
            var userId = localStorage.getItem('userId')
                , payer = obj.paidManId
                , leader = obj.contractLeaderId
                , partB = obj.partBId
                , status = obj.contractStatus
                , noHas = obj.read.indexOf(userId) == -1
                , showPayer
                , showLeader
                , showPartB;

            if (payer == userId) {
                showPayer = noHas && (status == 5);
            }
            if (leader == userId) {
                showLeader = noHas && (status == 3 || status == 4 || status == 6 || status == 7);
            }
            if (partB == userId) {
                showPartB = noHas && (status == 2 || status == 6 || status == 7);
            }
            return (showPayer || showLeader || showPartB);
        }
    }

    ng.module('myContract')
      .factory({
          pageService: pageFactory,
          computeProgress: computeProgressFactory,
          redDotService: redDotFactory
      });


/*============================================== 过滤器 ===============================================================*/
    function statusFilter() {
        var statusMap = {
            1: '未发送',
            2: '已发送',
            3: '已退回',
            4: '进行中',
            5: '待支付',
            6: '已完成',
            7: '已支付',
            8: '已作废'
        };
        return function (input) {
            return statusMap[input];
        }
    }

    ng.module('myContract')
      .filter('status', statusFilter);


/*============================================== 指令 =================================================================*/
    function myContractSiftDirective() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: setPath('sift.html')
        }
    }

    function myContractListDirective() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: setPath('list.html')
        }
    }

    ng.module('myContract')
      .directive({
          'myContractSift': myContractSiftDirective,
          'myContractList': myContractListDirective
      });


/*============================================== 控制器 ===============================================================*/
    myContractListCtrl.$inject = ['$scope', '$filter', '$state', 'pageService', '$rootScope', 'computeProgress',
        'redDotService'];
    function myContractListCtrl($scope, $filter, $state, pageService, $rootScope, computeProgress, redDotService) {

        // 匹配编辑模块
        $rootScope.taskCardOptions = [{
            "name": "",
            "id": "",
            "startTime": '',
            "endTime": '',
            "modelName": '',
            "modelId": ''
        }];

        $scope.useSift = false;
        $scope.totalPage = 0;
        $scope.curPage = 1;
        $scope.MCpageList=[];
        $scope.choosePage = false;
        $scope.statusTemp = [];

        $scope.items = [
            {name: '未发送', checked: false, code: 1, show: true},
            {name: '已发送',checked: false,code: 2,show: true},
            {name: '已退回',checked: false, code: 3,show: true},
            {name: '进行中',checked: false,code: 4,show: true},
            {name: '待支付',checked: false, code: 5, show: true},
            {name: '已支付', checked: false, code: 7, show: true},
            {name: '已完成', checked: false, code: 6, show: true},
            {name: '已作废', checked: false, code: 8, show: true}
        ];

        angular.element('body').on('click.ompa',function(event){
            var $target = $(event.target);

            if($target.hasClass('MC-cur-page')){
                $scope.choosePage = !$scope.choosePage;
            }else if($target.hasClass('MC-cur-page-choose')){
                $scope.choosePage = !$scope.choosePage;
            }else if($target.parent().hasClass('MC-cur-page-choose')){
                $scope.curPage = parseInt($target.index())+1;
                $scope.choosePage = !$scope.choosePage;
            }else{
                $scope.choosePage = false;
            }
        });

        $scope.togglePanel = function () {
            $scope.isShow = !$scope.isShow;
        };

        $scope.toggleItem = function (item) {
            this.item.checked = !this.item.checked
        };

        $scope.whetherShowNeedPay= function(taskPercent, payPercent){

            var _this= this;
            if(localStorage.getItem('curMenu')=== 'myContract')
            {
                if($('#aside-nav').find('li[class=\'current\']').attr('ng-click').indexOf('send')> 0)
                {
                    if(parseInt(_this.contract.status)!= 4)//合同是状态是“进行中”才判断
                    {
                        return false;
                    }
                    return $.whetherNeedPay(taskPercent, payPercent);
                }
                return false;
            }

            return false;

        };

        $scope.goDetail = function () {
            var that = this;

            localStorage.setItem('curContractId', that.contract.id);
            if (that.contract.dot) {
                pageService.changeStatus({
                    readerId: localStorage.getItem('userId')
                }).success(function () {
                    $state.go('view.contract');
                });
            } else {
                $state.go('view.contract');
            }
        };

        $scope.pageNav = function (page) {
            switch (page) {
                case 'prev' || 'pre':
                    if ($scope.curPage <= 1) return;
                    $scope.curPage = $scope.curPage - 1;
                    break;

                case 'next':
                    if ($scope.curPage >= $scope.totalPage) return;
                    $scope.curPage = $scope.curPage + 1;
                    break;

                case 'first':
                    $scope.curPage = 1;
                    break;

                case 'last':
                    $scope.curPage = $scope.totalPage;
                    break;

                default:
                    if (!ng.isNumber(page) || page > $scope.totalPage || page < 1) return;
                    $scope.curPage = page;
            }
        };

        $scope.filterData = function () {
            pageService.filter({
                page: $scope.curPage - 1,
                status: $scope.statusCode,
                type: $scope.filterType
            }).success(function (result) {
                $scope.count = result.count;
                $scope.totalPage = Math.ceil(result.count / 10);
                $scope.MCpageList=[];
                for(var i=0;i<$scope.totalPage;i++){
                    $scope.MCpageList.push(i+1);
                }
                $scope.contracts = result.rows.map(function (dbContract) {
                    return {
                        id: dbContract.id,
                        code: dbContract.contractCode,
                        name: dbContract.contractName,
                        creator: dbContract.creator,
                        sender: dbContract.creator,
                        payer: dbContract.paidMan,
                        partBName: dbContract.partBName,
                        start: dbContract.taskCardStartTime,
                        end: dbContract.taskCardEndTime,
                        payPercent: completed(dbContract.payType, dbContract.paidStep - 1),
                        completed: computeProgress(dbContract.TaskVersion.Progresses),
                        status: dbContract.contractStatus,
                        dot: redDotService(dbContract)
                    }
                });
            });

            function completed(type, paid) {
                var typeArr = type.split('-');
                var percent = 0;
                for (var i = 0; i < paid; i++) {
                    percent += typeArr[i] / 1;
                }
                return percent * 10;
            }
        };

        // 点击其它地方关闭
        $(document).on('click.ompa', function (ev) {
            if ($(ev.target).parents('#myContractSift').length) return;

            $scope.isShow = false;
            if(localStorage.curMenu == 'myContract'){
                $scope.statusCode = $scope.statusTemp;
            }else{
                localStorage.setItem('curMenu', 'myContract');
            }
            $scope.$apply();
        });

        $scope.sureFilter = function() {
            $scope.clickSure = true;
            $scope.statusTemp = $scope.statusCode;
            $scope.useSift = !!$scope.statusTemp.length;
            $scope.isShow = false;
            $scope.filterData();
        };

        $scope.$watch('items', function () {
            var arr = [];
            $scope.items.map(function (item) {
                if (item.checked) {
                    arr.push(item.code);
                }
            });
            $scope.statusCode = arr;
        }, true);

        $scope.$watch('statusCode', function(newVal, oldVal) {
            if(newVal == oldVal) return;
            ng.forEach($scope.items, function (item) {
                if(newVal.indexOf(item.code) != -1){
                    item.checked = true;
                }else{
                    item.checked = false;
                }
            });
        }, true);

        $scope.$watchGroup(['curPage', 'filterType'], function (newVal, oldVal) {

            if(newVal[0] == oldVal[0] && newVal[1] == oldVal[1]) return;
            // 别的页面跳转过来的，不清除筛选
            if(newVal[1] != oldVal[1]){
                if($scope.clickSure){
                    $scope.items.map(function (item) {
                        item.checked = false;
                        item.show = true;
                    });
                    $scope.useSift = false;
                    $scope.statusTemp = [];
                }
                if (newVal[1] == 'pay') {
                    $scope.items[0]['show'] = false;
                    $scope.items[1]['show'] = false;
                    $scope.items[2]['show'] = false;
                    $scope.items[3]['show'] = false;
                } else if (newVal[1] == 'sign') {
                    $scope.items[0]['show'] = false;
                    $scope.items[2]['show'] = false;
                }
            }
            $scope.filterData();
        });

        $scope.$watchGroup(['senderDot', 'payDot', 'signDot'], function (data) {
            var showDot = $scope.signDot || $scope.payDot || $scope.senderDot;
            $('.myContractUnreadFlag').css('display', showDot ? 'block' : 'none');
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

            if (fromState.name == 'view.contract' && toState.name == 'main' && localStorage.curMenu == 'myContract') {
                $scope.filterData();
            }
            FUNC.getCurUserUnreadInfo(function (num, showFlag) {
                $scope.$apply(function () {
                    $scope.senderDot = num;
                });
                showFlag(num);
            }, function (num, showFlag) {
                $scope.$apply(function () {
                    $scope.payDot = num;
                });
                showFlag(num);
            }, function (num, showFlag) {
                $scope.$apply(function () {
                    $scope.signDot = num;
                });
                showFlag(num);
            })
        });

        // 我的合同
        if(localStorage.curMenu == 'myContract'){
            $scope.filterType = 'send';
            $scope.filterData();
        }

    }

    ng.module('myContract')
      .controller('myContractListCtrl', myContractListCtrl);

})();
