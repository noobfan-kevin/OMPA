/**
 * Created by hk60 on 2016/6/22.
 */
!function($,FuncForContract){
    var userId = localStorage.getItem('userId');
    var statusList = {};
    function getCurUserUnreadInfo(cb1, cb2, cb3){
        getContractLeadInfo(cb1);
        getPayLeadInfo(cb2);
        getPartBInfo(cb3);
    }

    function noop() { }
    function getContractLeadInfo(cb){
        cb = cb || noop;
        $.ajax({
            method:'get',
            url:'/api/contract/getContractByUserId',
            data:{type:1,userId:userId},
            success:function(success){
                statusList.contract = success;
                //console.log(success,'1111');
                cb(success, showFlag);
                showFlag(success);
            },
            error:function(err){
                console.log(err);
            }
        })
    }
    function getPayLeadInfo(cb){
        cb = cb || noop;
        $.ajax({
            method:'get',
            url:'/api/contract/getContractByUserId',
            data:{type:2,userId:userId},
            success:function(success){
                //console.log(success,'2222');
                statusList.paid = success;
                showFlag(success);
                cb(success, showFlag);
            },
            error:function(err){
                console.log(err);
            }
        })
    }
    function getPartBInfo(cb){
        cb = cb || noop;
        $.ajax({
            method:'get',
            url:'/api/contract/getContractByUserId',
            data:{type:3,userId:userId},
            success:function(success){
                statusList.partB = success;
                //console.log(success,'33333');
                showFlag(success);
                cb(success, showFlag);
            },
            error:function(err){
                console.log(err);
            }
        })
    }
    function showFlag(num){
        if(num!=0){
            $('.myContractUnreadFlag').show();
        }
    }
    FuncForContract.FUNC = {
        getCurUserUnreadInfo:getCurUserUnreadInfo,
        statusList:statusList
    }
}(jQuery,window);