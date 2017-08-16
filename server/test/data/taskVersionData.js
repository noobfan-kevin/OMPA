/**
 * Created by HeLiang on 2015/11/23.
 */
taskVersion = module.exports;

taskVersion.taskversion01 = {
    name:"创建新任务",
    version:1.0,
    status:-1,
    startDate:new Date("2015-10-10"),
    predictDate:new Date("2015-11-11"),
    endDate:new Date("2015-11-12"),
    priority:"A+",
    points:1500,
    remark:["新版本"]

};

taskVersion.taskversion02 = {
    name:"创建新任务",
    version:1.1,
    status:0,
    startDate:new Date("2015-11-15"),
    predictDate:new Date("2015-12-15"),
    endDate:new Date("2015-12-15"),
    priority:"B+",
    points:2000,
    remark:["二次更新"]

};

taskVersion.taskversion03 = {
    name:"创建新任务",
    version:2.0,
    status:1,
    startDate:new Date("2015-12-18"),
    predictDate:new Date("2016-1-20"),
    endDate:new Date("2016-1-22"),
    priority:"C",
    points:2200,
    remark:["版本有BUG"]

};