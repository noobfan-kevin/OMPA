/**
 * Created by HeLiang on 2015/11/23.
 */
progress = module.exports;

progress.progress01 = {
    name:"模型制作",
    step:"数据收集、模型建立、背景设置、成果输出",
    percent:1.0,
    startDate: new Date("2015-10-10"),
    predictDate: new Date("2015-10-20"),
    completeDate: new Date("2015-10-21"),
    auditors:[{name:"庞统", idea:true,isAudit:"0"},{name:"马良", idea:"true",isAudit:"0"}],
    remark:"完成",
    creatDate: new Date("2015-10-08"),
    status:"3"

};

progress.progress02 = {
    name:"场景制作",
    step:"策划、原画、建模、组合",
    percent:1.0,
    startDate: new Date("2015-10-10"),
    predictDate: new Date("2015-10-25"),
    completeDate: new Date("2015-10-26"),
    auditors:[{name:"关兴", idea:false,isAudit:"1"},{name:"张苞", idea:false,isAudit:"1"}],
    remark:"结束",
    creatDate: new Date("2015-10-08"),
    status:"2"
};

progress.progress03 = {
    name: "音乐创作",
    step: "选材、制作、调整、编辑",
    percent: 0.6,
    startDate: new Date("2015-10-10"),
    predictDate: new Date("2015-10-23"),
    auditors: [{name: "程昱", idea: null, isAudit: "1"}, {name: "贾诩", idea: null, isAudit: "1"}],
    remark: "中期",
    creatDate: new Date("2015-10-09"),
    status: "0"
};

progress.progress04 = {
    name: "剧本创作",
    step: "确定主题、撰写大纲、扩充情节、完善剧本",
    percent: 1.0,
    startDate: new Date("2015-10-10"),
    predictDate: new Date("2015-10-23"),
    completeDate: new Date("2015-10-23"),
    auditors: [{name: "曹仁", idea: null, isAudit: "1"}, {name: "李典", idea: null, isAudit: "1"}],
    remark: "结束",
    creatDate: new Date("2015-10-09"),
    status: "1"
};