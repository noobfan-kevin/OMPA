/**
 * Created by hk61 on 2016/3/7.
 */
(function() {


    function GUI() {

        this.gui = require('nw.gui');
        this.win = this.gui.Window.get();
    }

    GUI.prototype = {

        constructor: GUI,
        bMaximized: false,//是否处于最大化状态
        nLastWidth: 920,
        nLastHeight: 680,


        minWindow: function() {
            this.win.minimize();
        },
        maxWindow: function() {
            this.nLastWidth= this.win.width;
            this.nLastHeight= this.win.height;
            this.win.maximize();
            this.bMaximized= true;
            $("#RestoreAndMax").html("&#xe646;");
        },
        closeWindow: function() {
            noticeCreate.deleteAllFilesForNoticeCreate();
            this.win.close();
        },
        restoreWindow: function() {
            this.win.restore();
            this.win.resizeTo(this.nLastWidth, this.nLastHeight);
            this.bMaximized= false;
            $("#RestoreAndMax").html("&#xe62a;");
        },
        toggleWindow: function(){
            if(this.bMaximized)
            {
                this.restoreWindow();
            }
            else
            {
                this.maxWindow();
            }
        },
        initTray: function() {
            /*
             * 系统托盘配置
             * */
            var gui = this.gui;
            var win = this.win;
            var tray = new gui.Tray({
                'title':'ompa'
                , icon:'flower_16px.png'
                , tooltip: "ompa企业版"
            });


            var menu = new gui.Menu();
            //添加一个菜单
            menu.append(new gui.MenuItem({
                label: '退出程序',
                click: function() {
                    win.close();
                }
            }));

            tray.menu = menu;

            this.showGUI = true;
            var that = this;
            tray.on('click', function(){

                that.showGUI ? win.hide() : win.show();
                that.showGUI = !that.showGUI;
            });
            win.on('minimize', function() {
                that.showGUI = false;
            });
            win.on('maximize', function() {
                that.showGUI = true;
            })
        },
        setMoveWindowByDrag: function(obj, callbacks , limit) {
            var
                downX
                , downY
                , initX
                , initY
                , moveX
                , moveY
                , doc = document;

            var win = this.win;
            var _this= this;

            // 绑定事件函数
            function bindEvent(obj, event, callbacks) {
                obj.addEventListener(event, callbacks,false);
                return obj;
            }

            bindEvent(obj, 'mousedown', function (ev) {

                if (ev.target.nodeName.toLowerCase() !== obj.nodeName.toLowerCase()) return;

                downX = ev.screenX;
                downY = ev.screenY;
                initX = win.x;
                initY = win.y;

                bindEvent(doc, "mousemove", move);
                bindEvent(doc, "mouseup", up);
                bindEvent(doc, "selectstart", preventDefault);

                // 阻止默认选取
                function preventDefault(ev) {
                    ev.preventDefault();
                }

                function move(ev) {
                    //最大化时移动窗口则将窗口还原
                    if(_this.bMaximized)
                    {
                        //刚开始移动时如果鼠标位置在还原后窗口的外面，则移动窗口到鼠标附件
                        if(ev.screenX> _this.nLastWidth*0.9)
                        {
                            initX= ev.screenX- parseInt(_this.nLastWidth*0.8);
                            win.x = initX + ev.screenX - downX
                        }
                        _this.restoreWindow();
                    }

                    moveX = ev.screenX - downX;
                    moveY = ev.screenY - downY;
                    limit && limit.x || (win.x = initX + moveX);
                    limit && limit.y || (win.y = initY + moveY);
                    obj.style.cursor = 'default';
                    callbacks && callbacks.move && callbacks.move.bind(obj)(ev);
                }

                function up(ev) {
                    doc.removeEventListener('mousemove', move, false);
                    doc.removeEventListener('mouseup', up, false);
                    doc.removeEventListener('selectstart', preventDefault, false);
                }

                callbacks && callbacks.end && callbacks.bind(this)();
            });
        },
        setMaximizeWindowToggle: function(oneElem)  // 双击元素切换窗口最大化与还原状态
        {
            var _this= this;
            var elemName= oneElem.nodeName.toLowerCase();
            oneElem.ondblclick = function(ev) {
                if( ev.target.nodeName.toLowerCase() !== elemName )
                    return;

                _this.toggleWindow();
            }
        },
        setWindow: function(option) {
            if(!option) return;
            option = option || {};

            var win = this.win
                , posX
                , posY,
                width,
                height;

            // 宽高
            width = option.width || win.width;
            height = option.height || win.height;
            win.setMinimumSize(width, height);
            win.width = width;
            win.height = height;

            // 窗口大小是否可拖拽
            if(option.resizable !== void 0){
                win.setResizable(option.resizable);
            }

            // 位置
            posX = option.center ? (window.screen.width - width )/2:
                   option.x ? option.x : win.x;
            posY = option.center ? (window.screen.height - height)/2:
                   option.y ? option.y : win.y;
            win.moveTo(posX, posY);

        }

    };

    window.GUIAPI = new GUI();

})();
