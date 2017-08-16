/**
 * Created by hk61 on 2016/7/19.
 */
var statistics = (function() {
    var ng = angular;

    /****************************  config *********** START ***********************/
    ng.module('statsApp',[])
      .config(['$httpProvider', function ($httpProvider) {
          $httpProvider.defaults.headers.common['sid'] = localStorage.getItem('sid');
          $httpProvider.defaults.headers.common['userId'] = localStorage.getItem('userId');
      }]);



    /****************************  service *********** START ***********************/

    ztreeProvider.$inject = [];
    function ztreeProvider() {
        var that = this;

        this.ztree = $.fn.zTree;
        this.tZreeObj = null;
        this.default = {
            view: {
                selectedMulti: true,
                showIcon: false,
                showLine: false
            },
            check: {
                enable: true,
                halfCheck: true
            },
            data: {
                simpleData: {
                    enable: true,
                    pIdKey: 'fatherId'
                }
            },
            edit: {
                enable: false
            }
        };
        this.data = {};
        this.$get = function() {
            return {
                init: function(obj, zNodes) {
                    zNodes = zNodes || {};
                    that.tZreeObj =  that.ztree.init(obj, that.default, zNodes);
                    return that.ztreeObj;
                },
                config: function(config) {
                    ng.extend(that.default, config);
                    return that.ztree;
                },
                getZTreeObjById: function(zTreeId) {
                    return $.fn.zTree.getZTreeObj(zTreeId);
                },
                checkNodeByIds: function(ids, zTreeId, disabledCheck) {
                    var treeObj = $.fn.zTree.getZTreeObj(zTreeId);
                    var nodes = treeObj.transformToArray(treeObj.getNodes());
                    ids = Array.isArray(ids) ? ids: [ids]; // 保证为数组
                    nodes.forEach(function(node) {
                        if(ids.indexOf(node.id) != -1){
                            treeObj.checkNode(node, true, true);
                        }
                    });

                    if(disabledCheck){
                        nodes.forEach(function(node) {
                            treeObj.setChkDisabled(node, true)
                        })
                    }
                },
                clearCheck: function(zTreeId) {
                    var treeObj = $.fn.zTree.getZTreeObj(zTreeId);
                    treeObj.checkAllNodes(false);
                }
            }
        }
    }

    
    chartFactory.$inject = [];
    function chartFactory() {
        return {
            init: function(canvas, data, option) {
                var ctx = canvas.getContext('2d');
                var defaultOption = {

                };
                $.extend(true, defaultOption,option);
                return new Chart(ctx).Bar(data, defaultOption)
            }
        }
    }

    
    serverFactory.$inject = ['$http', 'baseUrl', 'zTree'];
    function serverFactory($http, baseUrl, zTree) {
        return {
            getList: function() {
                return $http({
                    method: 'get',
                    url: baseUrl + '/api/statistics/list/' + localStorage.projectId
                }).then(function(req) {
                    if(req.data.ok) return req.data.list
                })
            },
            getNodesByProjectId: function () {
                return $http({
                    method: 'get',
                    url: baseUrl + '/api/statistics/getNodesByProjectId/' + localStorage.projectId
                }).then(function(req) {
                    if(req.data.ok) return req.data.list
                })
            },
            create: function() {
                return $http({
                    method: 'post',
                    url: baseUrl + '/api/statistics/',
                    data: {
                        projectId: localStorage.projectId,
                        creatorId: localStorage.userId,
                        name: $('#newName').val(),
                        startTime: $('#newStartTime').val(),
                        endTime: $('#newEndTime').val(),
                        nodes: getCheckedNodeIds()
                    }
                }).then(function(req) {
                    if(req.data.ok) return req.data.data;
                })
            },
            deleteById: function(id) {
                return $http({
                    method: 'delete',
                    url: baseUrl + '/api/statistics/' + id
                }).then(function(req) {
                    if(req.data.ok) return req.data.data;
                })
            },
            getDetailById: function(id) {
                return $http({
                    method: 'get',
                    url: baseUrl + '/api/statistics/detail/' + id
                }).then(function(req) {
                    if(req.data.ok) return req.data.data;
                })
            },
            getDefaultStats: function() {
                return $http({
                    method: 'get',
                    url: baseUrl + '/api/statistics/default/' + localStorage.projectId
                }).then(function(req) {
                    if(req.data.ok) return req.data.data;
                })
            },
            update: function() {
                return $http({
                    method: 'put',
                    url: baseUrl + '/api/statistics/' + $('#zTreeNew').attr('data-stats-id'),
                    data: {
                        name: $('#newName').val(),
                        startTime: $('#newStartTime').val(),
                        endTime: $('#newEndTime').val(),
                        nodes: getCheckedNodeIds()
                    }
                }).then(function(req) {
                    if(req.data.ok) return req.data.data;
                })
            }
        };

        function getCheckedNodeIds() {
            var ids = [];
            var nodes = zTree.getZTreeObjById('zTreeNew').getCheckedNodes();
            nodes.forEach(function(node) {
                // 只取只取全选的，或为叶子节点的
                //ztree节点对象的check_Child_State(！checkType = "checkbox"的情况，checkType若为"radio"，请参考zTree API)
                // -1	不存在子节点 或 子节点全部设置为 nocheck = true;
                // 0	无 子节点被勾选
                // 1	部分 子节点被勾选
                // 2	全部 子节点被勾选
                if(node.check_Child_State === -1 || node.check_Child_State === 2){
                    ids.push(node.id);
                }
            });
            return ids;
        }

    }

    ng.module('statsApp')
      .constant('baseUrl', configInfo.server_url)
      .provider('zTree', ztreeProvider)
      .factory('server', serverFactory)
      .factory('chart', chartFactory);



    /****************************  directive *********** START ***********************/
    initZtreeDirect.$inject = ['zTree'];
    function initZtreeDirect(zTree) {
        return {
            restrict: 'A',
            scope: {
                zNodes: '='
            },
            link: function(scope, elements, attr) {
                var obj = elements[0];
                scope.$watch('zNodes', function(newVal) {
                    zTree.init(elements, newVal);
                }, true);
            }
        }
    }

    toggleStatsDirect.$inject = ['zTree', 'server', 'chart'];
    function toggleStatsDirect(zTree, server, chart) {
        return {
            restrict: "A",
            scope: {
                open: '=',
                height: '@openHeight',
                treeId: '=',
                treeNodes: '=',
                initialStatus: '@?',
                charData: '=',
                index: '=?'
            },
            link: function(scope, elements, attr) {
                var $wrap = $(elements).next();
                var $detailBox = $('.stats-detail-box', $wrap);
                var $inner = $('td', $wrap);
                var detailWrap = $('.stats-detail-box',elements.next());

                // 默认关闭
                scope.initialStatus = scope.initialStatus || 'close';
                if(scope.initialStatus ==='close'){
                    detailWrap.css({height:0});
                    $inner.hide();
                }else{
                    $inner.show();
                    detailWrap.css({
                        height: scope.height
                    });
                }

                elements.click(function(ev) {
                    // 编辑、删除不继续执行
                    if($(ev.target).hasClass('stats-item-edit') || $(ev.target).hasClass('stats-item-delete')) return;
                    var $treeBox = $('.ztree', $wrap);
                    var $canvas = $('canvas', $wrap);

                    // 展开收缩动画
                    if(scope.open){
                        $detailBox.animate({height:0}, 300, 'swing', function() {
                            $inner.hide();
                            scope.open = false;
                        })
                    }else{
                        $inner.show();
                        $detailBox.animate({height:scope.height}, 300, 'swing')
                    }
                    if(scope.open) return;

                    // 添加唯一id,做treeId
                    $treeBox.attr('id', scope.treeId);
                    $canvas.attr('id', 'barChar' + scope.index);

                    server.getDetailById(scope.treeId).then(function(result) {
                        var selectedIds = []
                            , nodes = []
                            , chartLabels = ['任务创建量','任务完成量','合同创建量','合同签约量','合同完成量']
                            , taskData = []
                            , contractData = [];

                        selectedIds = result.StepInfos.map(function (dbNode) {
                            //chartLabels.push(dbNode.name);
                            taskData.push(dbNode.totalTask);
                            contractData.push(dbNode.totalContract);
                            return dbNode.id;
                        });

                        // 复制一份，并使其不可编辑。（避免影响新建树）
                        nodes = $.extend(true, [], scope.treeNodes);
                        var chartData = {
                            labels : chartLabels,
                            datasets : [
                                {
                                    label: '任务',
                                    fillColor : "rgba(220,220,220,0.5)",
                                    strokeColor : "rgba(220,220,220,1)",
                                    data : [scope.charData.totalTask,
                                        scope.charData.doneTask,
                                        scope.charData.totalContract,
                                        scope.charData.signedContract,
                                        scope.charData.doneContract
                                        ]
                                }
                            ]
                        };

                        // 初始化默认树
                        zTree.init($treeBox, nodes);
                        // 初始化柱状图
                        chart.init($canvas.get(0), chartData);

                        // 勾选树节点,并禁用编辑
                        zTree.checkNodeByIds(selectedIds, scope.treeId, true);
                    });

                    // 内部滚动
                    $treeBox.get(0).onmousewheel = function(ev) {
                        this.scrollTop += ev.wheelDelta < 0 ? 10 : -10;
                        return false;
                    };

                    scope.open = !scope.open;
                });

            }
        }
    }

    ng.module('statsApp')
      .directive('toggleStats', toggleStatsDirect)
      .directive('bindZtree', initZtreeDirect);



    /****************************  controller *********** START ***********************/
    statsController.$inject = ['$scope', 'server', 'zTree', '$filter'];
    function statsController(scope, server, zTree, $filter) {
        scope.statsList = []; // 统计列表
        scope.zNodes = [];  // 项目下所有节点
        scope.newStats = {  // 新建、编辑 input值
            name: '',
            startTime: '',
            endTime: ''
        };


        // 获取默认统计
        server.getDefaultStats().then(function(data) {
            scope.defaultStats = data;
        });

        // 获取整个项目的节点树;
        server.getNodesByProjectId().then(function(list) {
            scope.zNodes = list;
        });

        // 获取统计列表
        server.getList().then(function(list) {
            scope.statsList = list;
        });

        // 关闭新建
        scope.closeDialog = function() {
            scope.showNewDialog = false;
        };

        // 打开新建界面
        scope.showDialog = function(isEdit) {
            scope.isEdit = !!isEdit;
            scope.showNewDialog = true;

            //if(scope.isEdit) return; // 新建清空
            scope.newStats = {  // 新建、编辑 input值重置
                name: '',
                startTime: '',
                endTime: ''
            };
            zTree.clearCheck('zTreeNew');
        };

        // 新建、编辑统计
        scope.saveStats = function() {
            var index = $('#zTreeNew').attr('data-stats-index');
            if(scope.isEdit){
                server.update().then(function(data) {
                    scope.closeDialog();
                    scope.statsList[index] = data;
                });
            }else{
                server.create().then(function(data) {
                    scope.statsList.push(data);
                    scope.closeDialog();
                });
            }
        };

        // 打开编辑
        scope.editStats = function() {
            var ids = [];
            var stats = this.stats;
            var index = this.$index;

            scope.showDialog(true);
            scope.newStats = {
                name: stats.name,
                startTime: $filter('date')(stats.startTime, 'yyyy-MM-dd'),
                endTime: $filter('date')(stats.endTime, 'yyyy-MM-dd')
            };
            ids = stats.StepInfos.map(function(node) {
                return node.id;
            });
            $('#zTreeNew').attr({
                'data-stats-id': stats.id,
                'data-stats-index': index
            });
            zTree.checkNodeByIds(ids, 'zTreeNew');
        };

        // 删除统计
        scope.deleteStats = function(id, index) {
            departmentObj.showAskModel('确定要删除吗？', true, function(ok) {
                if(!ok) return;
                server.deleteById(id).then(function() {
                    scope.statsList.splice(index, 1);
                    console.log('删除统计成功', index);
                })
            });
        };


    }

    ng.module('statsApp')
      .controller('statsCtrl',statsController);


    return {
        createDefault: function(projectId) {
            $.ajax({
                method: 'post',
                url: '/api/statistics/',
                data: {
                    projectId: projectId,
                    creatorId: localStorage.userId,
                    name: '项目下所有',
                    nodes: []
                },
                success: function() {
                    console.log('创建默认统计：项目下所有');
                }
            })
        }
    }
})();