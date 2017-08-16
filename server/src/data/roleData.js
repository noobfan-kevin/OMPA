/**
 * Created by YanJixian on 2015/11/19.
 */
roles = module.exports;
roles.superAdmin =  {
    name: '高级管理员',
    type: true,
    defaultAuthorities:[
        'Manage_All_Project',
        'Manage_All_Pro_Tasks',
        'Manage_All_Pro_Contracts',
        'See_All_Project',
        'Receive_Pro_Taskcard',
        'Manage_department&user&role',
        'Manage_Contractor'
    ]
};

roles.filmMakingAdmin   =  {
    name: '制片管理员',
    type: true,
    defaultAuthorities:[
        'Manage_All_Project',
        'Manage_All_Pro_Contracts',
        'See_All_Project',
        'Receive_Pro_Taskcard',
        'Manage_Contractor'
    ]
};

roles.productionAdmin = {
    name: '生产管理员',
    type: true,
    defaultAuthorities:[
        'Manage_All_Pro_Tasks',
        'See_All_Project',
        'Receive_Pro_Taskcard'
    ]
};
roles.outerAdmin = {
    name: '签约方',
    type: true,
    defaultAuthorities:[
        'Receive_Pro_Taskcard',
        'Receive_Pro_Contracts'
    ]

};
roles.commonUser = {
    name: '普通人员',
    type: true,
    defaultAuthorities:[
        'Receive_Pro_Taskcard'
    ]
};