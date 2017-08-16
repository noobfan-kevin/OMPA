define({ "api": [
  {
    "type": "post",
    "url": "/api/chat",
    "title": "新建聊天",
    "name": "AddChat",
    "group": "Chatting",
    "permission": [
      {
        "name": "All"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "senderId",
            "description": "<p>发送人编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "type",
            "description": "<p>接收类型</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "category",
            "description": "<p>类别</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "content",
            "description": "<p>聊天内容</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "time",
            "description": "<p>发送时间</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "status",
            "description": "<p>状态(已读：true；未读：false)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "attachmentAmount",
            "description": "<p>附件数量</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/chat.js",
    "groupTitle": "Chatting"
  },
  {
    "type": "put",
    "url": "/api/chat/:chatId",
    "title": "修改个人聊天状态",
    "name": "EditChatStatus",
    "group": "Chatting",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "chatId",
            "description": "<p>消息编号</p> "
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "<p>Boolean</p> ",
            "optional": true,
            "field": "status",
            "description": "<p>消息状态（已读未读）</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>更新操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/chat.js",
    "groupTitle": "Chatting"
  },
  {
    "type": "get",
    "url": "/api/chat",
    "title": "查询个人聊天记录",
    "name": "getChat",
    "group": "Chatting",
    "permission": [
      {
        "name": "All"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "senderId",
            "description": "<p>发送人编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "senderId",
            "description": "<p>发送人编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "type",
            "description": "<p>接收类型</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "category",
            "description": "<p>类别</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "content",
            "description": "<p>聊天内容</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "time",
            "description": "<p>发送时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "attachmentAmount",
            "description": "<p>附件数量</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "status",
            "description": "<p>状态(已读：true；未读：false)</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>结果数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/chat.js",
    "groupTitle": "Chatting"
  },
  {
    "type": "get",
    "url": "/api/chat/queryGroup/:groupId",
    "title": "查询群聊天记录",
    "name": "getGroupChat",
    "group": "Chatting",
    "permission": [
      {
        "name": "All"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "senderId",
            "description": "<p>发送人编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "type",
            "description": "<p>接收类型</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "category",
            "description": "<p>类别</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "content",
            "description": "<p>聊天内容</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "time",
            "description": "<p>发送时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "attachmentAmount",
            "description": "<p>附件数量</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>结果数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/chat.js",
    "groupTitle": "Chatting"
  },
  {
    "type": "get",
    "url": "/api/chat/queryByRereceiver/:receiverId",
    "title": "查询未读信息(个人)",
    "name": "getQueryByRereceiver",
    "group": "Chatting",
    "permission": [
      {
        "name": "All"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "senderId",
            "description": "<p>发送人编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "type",
            "description": "<p>接收类型</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "category",
            "description": "<p>类别</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "content",
            "description": "<p>聊天内容</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "time",
            "description": "<p>发送时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "attachmentAmount",
            "description": "<p>附件数量</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "status",
            "description": "<p>状态(已读：true；未读：false)</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>结果数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/chat.js",
    "groupTitle": "Chatting"
  },
  {
    "type": "get",
    "url": "/api/chat/getNoReadInfo/:receiverId",
    "title": "查询未读信息",
    "name": "getQueryNoReadInfo",
    "group": "Chatting",
    "permission": [
      {
        "name": "All"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>结果数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/chat.js",
    "groupTitle": "Chatting"
  },
  {
    "type": "get",
    "url": "/api/chat/updateOnReadByRereceiverId/:receiverId",
    "title": "修改信息状态(个人)",
    "name": "getUpdateOnReadByRereceiverId",
    "group": "Chatting",
    "permission": [
      {
        "name": "All"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/chat.js",
    "groupTitle": "Chatting"
  },
  {
    "type": "get",
    "url": "/api/chat/queryRecentlyChat/:userId",
    "title": "查询最近聊天人",
    "name": "queryRecentlyChat",
    "group": "Chatting",
    "permission": [
      {
        "name": "All"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "userId",
            "description": "<p>用户编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>个人信息</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/chat.js",
    "groupTitle": "Chatting"
  },
  {
    "type": "get",
    "url": "/api/chat/queryRecentlyGroupChat/:userId",
    "title": "查询最近聊天群",
    "name": "queryRecentlyGroupChat",
    "group": "Chatting",
    "permission": [
      {
        "name": "All"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "userId",
            "description": "<p>用户编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>群组信息</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/chat.js",
    "groupTitle": "Chatting"
  },
  {
    "type": "post",
    "url": "/api/department",
    "title": "管理员添加部门",
    "name": "AddDepartment",
    "group": "Department",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>部门名称</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "fatherId",
            "description": "<p>父级部门id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "_id",
            "description": "<p>部门id</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "fatherId",
            "defaultValue": "0",
            "description": "<p>父级部门id</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>部门名称</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createTime",
            "description": "<p>建立时间</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/department.js",
    "groupTitle": "Department"
  },
  {
    "type": "delete",
    "url": "/api/department/:departmentId",
    "title": "删除部门",
    "name": "DeleteDepartment",
    "group": "Department",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "departmentId",
            "description": "<p>需要删除的部门id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>删除操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/department.js",
    "groupTitle": "Department"
  },
  {
    "type": "put",
    "url": "/api/department/:departmentId",
    "title": "修改部门信息",
    "name": "EditDepartment",
    "group": "Department",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "departmentId",
            "description": "<p>部门Id</p> "
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "name",
            "description": "<p>部门名称</p> "
          },
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "fatherId",
            "description": "<p>父级部门id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>更新操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/department.js",
    "groupTitle": "Department"
  },
  {
    "type": "get",
    "url": "/api/department/:departmentId",
    "title": "查询部门信息",
    "name": "GetDepartment",
    "group": "Department",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "departmentId",
            "description": "<p>部门Id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "_id",
            "description": "<p>部门id</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "fatherId",
            "defaultValue": "0",
            "description": "<p>父级部门id</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>部门名称</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createTime",
            "description": "<p>建立时间</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/department.js",
    "groupTitle": "Department"
  },
  {
    "type": "get",
    "url": "/api/department/members",
    "title": "查询部门及成员",
    "name": "GetDepartmentAndMemberList",
    "group": "Department",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "conditions",
            "defaultValue": "{}",
            "description": "<p>查询条件</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "fields",
            "description": "<p>查询字段</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "options",
            "defaultValue": "{}",
            "description": "<p>查询选项，分页、排序</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "分页请求部门和成员:",
          "content": "{\n    conditions: {},\n    fields: \"\",\n    options: {skip: 10,limit: 5}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>部门数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/department.js",
    "groupTitle": "Department"
  },
  {
    "type": "get",
    "url": "/api/department/count",
    "title": "查询部门数",
    "name": "GetDepartmentCount",
    "group": "Department",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "conditions",
            "defaultValue": "{}",
            "description": "<p>查询条件</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "count",
            "description": "<p>符合条件的部门数</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/department.js",
    "groupTitle": "Department"
  },
  {
    "type": "get",
    "url": "/api/department",
    "title": "查询部门列表",
    "name": "GetDepartmentList",
    "group": "Department",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "conditions",
            "defaultValue": "{}",
            "description": "<p>查询条件</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "fields",
            "description": "<p>查询字段</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "options",
            "defaultValue": "{}",
            "description": "<p>查询选项，分页、排序</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "分页请求部门name字段:",
          "content": "conditions = {} &\nfields = \"name\" &\noptions = {skip: 10,limit: 5}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>部门数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/department.js",
    "groupTitle": "Department"
  },
  {
    "type": "get",
    "url": "/api/department/:departmentId/members",
    "title": "查询部门成员",
    "name": "GetDepartmentMembers",
    "group": "Department",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "departmentId",
            "description": "<p>部门Id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>成员数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/department.js",
    "groupTitle": "Department"
  },
  {
    "type": "get",
    "url": "/api/department/exist",
    "title": "部门名称是否存在",
    "name": "QueryDepartmentName",
    "group": "Department",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>部门名称</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>是否存在</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/department.js",
    "groupTitle": "Department"
  },
  {
    "type": "delete",
    "url": "/api/file/:fileId",
    "title": "删除文件",
    "name": "DeleteFile",
    "group": "File",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "fileId",
            "description": "<p>文件Id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>删除操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/file.js",
    "groupTitle": "File"
  },
  {
    "type": "get",
    "url": "/api/file/:fileId",
    "title": "查询文件信息",
    "name": "GetFile",
    "group": "File",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "fileId",
            "description": "<p>文件Id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "originalName",
            "description": "<p>上传文件原文件名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "filename",
            "description": "<p>上传后的文件名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>上传后的文件相对路径</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "ext",
            "description": "<p>文件后缀名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "size",
            "description": "<p>文件大小</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sourceKey",
            "description": "<p>来源主键编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "sourceType",
            "description": "<p>来源类型</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorId",
            "description": "<p>上传作者</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "time",
            "description": "<p>上传时间</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/file.js",
    "groupTitle": "File"
  },
  {
    "type": "get",
    "url": "/api/file/folderAll/:fatherId",
    "title": "查询文件信息",
    "name": "GetFile",
    "group": "File",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "fatherId",
            "description": "<p>文件Id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "originalName",
            "description": "<p>上传文件原文件名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "filename",
            "description": "<p>上传后的文件名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>上传后的文件相对路径</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "ext",
            "description": "<p>文件后缀名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "size",
            "description": "<p>文件大小</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sourceKey",
            "description": "<p>来源主键编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "sourceType",
            "description": "<p>来源类型</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorId",
            "description": "<p>上传作者</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "time",
            "description": "<p>上传时间</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/file.js",
    "groupTitle": "File"
  },
  {
    "type": "get",
    "url": "/api/file/father/:fatherId",
    "title": "查询文件信息",
    "name": "GetFile",
    "group": "File",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "fatherId",
            "description": "<p>文件Id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "originalName",
            "description": "<p>上传文件原文件名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "filename",
            "description": "<p>上传后的文件名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>上传后的文件相对路径</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "ext",
            "description": "<p>文件后缀名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "size",
            "description": "<p>文件大小</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sourceKey",
            "description": "<p>来源主键编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "sourceType",
            "description": "<p>来源类型</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorId",
            "description": "<p>上传作者</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "time",
            "description": "<p>上传时间</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/file.js",
    "groupTitle": "File"
  },
  {
    "type": "get",
    "url": "/api/file",
    "title": "获取文件列表",
    "name": "GetFileList",
    "group": "File",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "conditions",
            "defaultValue": "{}",
            "description": "<p>查询条件</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "fields",
            "description": "<p>查询字段</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "options",
            "defaultValue": "{}",
            "description": "<p>查询选项，分页、排序</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "请求用户aa上传的文件:",
          "content": "{\n    conditions: {authorId：'aa'}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>文件数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/file.js",
    "groupTitle": "File"
  },
  {
    "type": "get",
    "url": "/api/file/group/:groupId",
    "title": "查询群文件",
    "name": "GetGroupFile",
    "group": "File",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "fatherId",
            "description": "<p>文件Id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "originalName",
            "description": "<p>上传文件原文件名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "filename",
            "description": "<p>上传后的文件名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>上传后的文件相对路径</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "ext",
            "description": "<p>文件后缀名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "size",
            "description": "<p>文件大小</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sourceKey",
            "description": "<p>来源主键编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "sourceType",
            "description": "<p>来源类型</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorId",
            "description": "<p>上传作者</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "time",
            "description": "<p>上传时间</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/file.js",
    "groupTitle": "File"
  },
  {
    "type": "post",
    "url": "/api/file/upload",
    "title": "上传接口",
    "name": "UploadFile",
    "group": "File",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>File</p> ",
            "optional": false,
            "field": "file",
            "description": "<p>需要上传的文件</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "sourceType",
            "description": "<p>来源类型</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sourceKey",
            "description": "<p>来源主键编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "originalName",
            "description": "<p>上传文件原文件名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "filename",
            "description": "<p>上传后的文件名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>上传后的文件相对路径</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "ext",
            "description": "<p>文件后缀名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "size",
            "description": "<p>文件大小</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sourceKey",
            "description": "<p>来源主键编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "sourceType",
            "description": "<p>来源类型</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorId",
            "description": "<p>上传作者</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "time",
            "description": "<p>上传时间</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/file.js",
    "groupTitle": "File"
  },
  {
    "type": "post",
    "url": "/api/file/copyFile",
    "title": "截图上传接口",
    "name": "copyFile",
    "group": "File",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>文件夹或文件名称</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>修改操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/file.js",
    "groupTitle": "File"
  },
  {
    "type": "post",
    "url": "/api/file/cutFile",
    "title": "截图上传接口",
    "name": "cutFile",
    "group": "File",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>文件夹或文件名称</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>修改操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/file.js",
    "groupTitle": "File"
  },
  {
    "type": "get",
    "url": "/api/file/download/:name",
    "title": "下载文件接口",
    "name": "downloadFile",
    "group": "File",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>下载的文件名</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>File</p> ",
            "optional": false,
            "field": "file",
            "description": "<p>下载的文件</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/file.js",
    "groupTitle": "File"
  },
  {
    "type": "post",
    "url": "/api/file/newFolder",
    "title": "添加目录",
    "name": "newFolder",
    "group": "File",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>文件夹名称</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "originalName",
            "description": "<p>上传文件原文件名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "filename",
            "description": "<p>上传后的文件名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>上传后的文件相对路径</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "ext",
            "description": "<p>文件后缀名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "size",
            "description": "<p>文件大小</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sourceKey",
            "description": "<p>来源主键编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "sourceType",
            "description": "<p>来源类型</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorId",
            "description": "<p>上传作者</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "time",
            "description": "<p>上传时间</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/file.js",
    "groupTitle": "File"
  },
  {
    "type": "post",
    "url": "/api/file/updateName",
    "title": "截图上传接口",
    "name": "updateName",
    "group": "File",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>文件夹或文件名称</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>修改操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/file.js",
    "groupTitle": "File"
  },
  {
    "type": "post",
    "url": "/api/file/uploadCuteImage",
    "title": "截图上传接口",
    "name": "uploadCuteImage",
    "group": "File",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "imagesrc",
            "description": "<p>截图字符串</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "filename",
            "description": "<p>文件名称</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "originalName",
            "description": "<p>上传文件原文件名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "filename",
            "description": "<p>上传后的文件名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>上传后的文件相对路径</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "ext",
            "description": "<p>文件后缀名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "size",
            "description": "<p>文件大小</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sourceKey",
            "description": "<p>来源主键编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "sourceType",
            "description": "<p>来源类型</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorId",
            "description": "<p>上传作者</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "time",
            "description": "<p>上传时间</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/file.js",
    "groupTitle": "File"
  },
  {
    "type": "post",
    "url": "/api/group",
    "title": "新建群组",
    "name": "AddGroup",
    "group": "Group",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>群组名称</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "creatorId",
            "description": "<p>创建人编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "creatorName",
            "description": "<p>创建人姓名</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "groupImage",
            "description": "<p>群图标</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "attachmentAmount",
            "description": "<p>附件数量</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createTime",
            "description": "<p>创建时间</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "values",
            "description": "<p>结果数据</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/group.js",
    "groupTitle": "Group"
  },
  {
    "type": "post",
    "url": "/api/group/:groupId",
    "title": "添加群组成员",
    "name": "AddMember",
    "group": "Group",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "groupId",
            "description": "<p>群组编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "members",
            "description": "<p>群成员编号数组</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/group.js",
    "groupTitle": "Group"
  },
  {
    "type": "put",
    "url": "/api/group/members/:groupId",
    "title": "删除群组成员",
    "name": "DelMembersByGroup",
    "group": "Group",
    "permission": [
      {
        "name": "Leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "groupId",
            "description": "<p>群编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "userId",
            "description": "<p>成员编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/group.js",
    "groupTitle": "Group"
  },
  {
    "type": "delete",
    "url": "/api/group/:groupId",
    "title": "删除群组",
    "name": "DeleteGroup",
    "group": "Group",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "groupId",
            "description": "<p>群组编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/group.js",
    "groupTitle": "Group"
  },
  {
    "type": "get",
    "url": "/api/group/all",
    "title": "查询所有群组列表",
    "name": "GetAllGroupList",
    "group": "Group",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "conditions",
            "defaultValue": "{}",
            "description": "<p>查询条件</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "fields",
            "description": "<p>查询字段</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "options",
            "defaultValue": "{}",
            "description": "<p>查询选项，分页、排序</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "分页请求群组字段:",
          "content": "conditions = {}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>通知数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/group.js",
    "groupTitle": "Group"
  },
  {
    "type": "get",
    "url": "/api/group/info/:groupId",
    "title": "取得群组信息",
    "name": "GetGroup",
    "group": "Group",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "groupId",
            "description": "<p>群组Id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "_id",
            "description": "<p>群组编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>群组名称</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "creatorId",
            "description": "<p>创建人编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "creatorName",
            "description": "<p>创建人姓名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "groupImage",
            "description": "<p>群图标</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "attachmentAmount",
            "description": "<p>附件数量</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createTime",
            "description": "<p>创建时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>结果数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/group.js",
    "groupTitle": "Group"
  },
  {
    "type": "get",
    "url": "/api/group/count",
    "title": "查询群组数",
    "name": "GetGroupCount",
    "group": "Group",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "conditions",
            "defaultValue": "{}",
            "description": "<p>查询条件</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "count",
            "description": "<p>符合条件的群组数</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/group.js",
    "groupTitle": "Group"
  },
  {
    "type": "get",
    "url": "/api/group",
    "title": "查询群组列表",
    "name": "GetGroupList",
    "group": "Group",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "conditions",
            "defaultValue": "{}",
            "description": "<p>查询条件</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "fields",
            "description": "<p>查询字段</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "options",
            "defaultValue": "{}",
            "description": "<p>查询选项，分页、排序</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "分页请求群组name字段:",
          "content": "conditions = {} &\nfields = \"name\" &\noptions = {skip: 10,limit: 5}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>通知数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/group.js",
    "groupTitle": "Group"
  },
  {
    "type": "get",
    "url": "/api/group/:userId",
    "title": "获取个人所属群信息",
    "name": "GetGroupsByUser",
    "group": "Group",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "userId",
            "description": "<p>用户编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "_id",
            "description": "<p>群组编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>群组名称</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "creatorId",
            "description": "<p>创建人编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "creatorName",
            "description": "<p>创建人姓名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "groupImage",
            "description": "<p>群图标</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "attachmentAmount",
            "description": "<p>附件数量</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createTime",
            "description": "<p>创建时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>结果数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/group.js",
    "groupTitle": "Group"
  },
  {
    "type": "get",
    "url": "/api/group/members/:groupId",
    "title": "根据群编号查询群成员信息",
    "name": "GetMembersByGroup",
    "group": "Group",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "groupId",
            "description": "<p>群编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "_id",
            "description": "<p>用户id</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>用户名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>真实姓名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "label",
            "description": "<p>个人签名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "image",
            "description": "<p>头像链接</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "weixin",
            "description": "<p>微信号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>邮箱</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "occupationName",
            "description": "<p>职位</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "birthday",
            "description": "<p>生日</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "departmentId",
            "description": "<p>所属部门Id</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "level",
            "description": "<p>用户级别</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "points",
            "defaultValue": "0",
            "description": "<p>用户积分</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "online",
            "description": "<p>在线状态groups</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "groups",
            "description": "<p>所属群</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>结果数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/group.js",
    "groupTitle": "Group"
  },
  {
    "type": "put",
    "url": "/api/group/:groupId",
    "title": "修改群信息",
    "name": "UpdateGroup",
    "group": "Group",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "groupId",
            "description": "<p>群组编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>群组名称</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "groupImage",
            "description": "<p>图标</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/group.js",
    "groupTitle": "Group"
  },
  {
    "type": "get",
    "url": "/api/group/membersGroup/:groupId",
    "title": "获取未进群的用户",
    "name": "queryMembersGroup",
    "group": "Group",
    "permission": [
      {
        "name": "Leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "groupId",
            "description": "<p>群编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "res2",
            "description": "<p>未添加的用户数据</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/group.js",
    "groupTitle": "Group"
  },
  {
    "type": "post",
    "url": "/api/inform",
    "title": "新建通知",
    "name": "AddInform",
    "group": "Inform",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "title",
            "description": "<p>标题</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "contents",
            "description": "<p>内容</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorId",
            "description": "<p>作者编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorName",
            "description": "<p>作者姓名</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createTime",
            "description": "<p>创建时间</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "attachmentAmount",
            "description": "<p>附件数量</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/inform.js",
    "groupTitle": "Inform"
  },
  {
    "type": "post",
    "url": "/api/inform",
    "title": "新建通知",
    "name": "AddInform",
    "group": "Inform",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "title",
            "description": "<p>标题</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "contents",
            "description": "<p>内容</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorId",
            "description": "<p>作者编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorName",
            "description": "<p>作者姓名</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createTime",
            "description": "<p>创建时间</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "attachmentAmount",
            "description": "<p>附件数量</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/role.js",
    "groupTitle": "Inform"
  },
  {
    "type": "delete",
    "url": "/api/inform/:informId",
    "title": "删除通知",
    "name": "DeleteInform",
    "group": "Inform",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "informId",
            "description": "<p>通知编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/role.js",
    "groupTitle": "Inform"
  },
  {
    "type": "delete",
    "url": "/api/inform/:informId",
    "title": "删除通知",
    "name": "DeleteInform",
    "group": "Inform",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "informId",
            "description": "<p>通知编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/inform.js",
    "groupTitle": "Inform"
  },
  {
    "type": "get",
    "url": "/api/inform/:informId",
    "title": "取得通知信息",
    "name": "GetInform",
    "group": "Inform",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "informId",
            "description": "<p>通知编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "title",
            "description": "<p>标题</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "contents",
            "description": "<p>内容</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorId",
            "description": "<p>创建人编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorName",
            "description": "<p>创建人姓名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "attachmentAmount",
            "description": "<p>附件数量</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createTime",
            "description": "<p>创建时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>结果数组·</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/inform.js",
    "groupTitle": "Inform"
  },
  {
    "type": "get",
    "url": "/api/inform/:informId",
    "title": "取得通知信息",
    "name": "GetInform",
    "group": "Inform",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "informId",
            "description": "<p>通知编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "title",
            "description": "<p>标题</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "contents",
            "description": "<p>内容</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorId",
            "description": "<p>创建人编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorName",
            "description": "<p>创建人姓名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "attachmentAmount",
            "description": "<p>附件数量</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createTime",
            "description": "<p>创建时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>结果数组·</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/role.js",
    "groupTitle": "Inform"
  },
  {
    "type": "get",
    "url": "/api/inform/count",
    "title": "查询通知数",
    "name": "GetInformCount",
    "group": "Inform",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "conditions",
            "defaultValue": "{}",
            "description": "<p>查询条件</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "count",
            "description": "<p>符合条件的通知数</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/inform.js",
    "groupTitle": "Inform"
  },
  {
    "type": "get",
    "url": "/api/inform/count",
    "title": "查询通知数",
    "name": "GetInformCount",
    "group": "Inform",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "conditions",
            "defaultValue": "{}",
            "description": "<p>查询条件</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "count",
            "description": "<p>符合条件的通知数</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/role.js",
    "groupTitle": "Inform"
  },
  {
    "type": "get",
    "url": "/api/inform",
    "title": "查询通知列表",
    "name": "GetInformList",
    "group": "Inform",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "conditions",
            "defaultValue": "{}",
            "description": "<p>查询条件</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "fields",
            "description": "<p>查询字段</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "options",
            "defaultValue": "{}",
            "description": "<p>查询选项，分页、排序</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "分页请求通知title字段:",
          "content": "conditions = {} &\nfields = \"title\" &\noptions = {skip: 10,limit: 5}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>通知数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/inform.js",
    "groupTitle": "Inform"
  },
  {
    "type": "put",
    "url": "/api/inform/:informId",
    "title": "修改通知",
    "name": "UpdateInform",
    "group": "Inform",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "informId",
            "description": "<p>通知编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "title",
            "description": "<p>标题</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "contents",
            "description": "<p>内容</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "attachmentAmount",
            "description": "<p>附件数量</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/role.js",
    "groupTitle": "Inform"
  },
  {
    "type": "put",
    "url": "/api/inform/:informId",
    "title": "修改通知",
    "name": "UpdateInform",
    "group": "Inform",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "informId",
            "description": "<p>通知编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "title",
            "description": "<p>标题</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "contents",
            "description": "<p>内容</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "attachmentAmount",
            "description": "<p>附件数量</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/inform.js",
    "groupTitle": "Inform"
  },
  {
    "type": "get",
    "url": "/api/messageStatus/:receiverId",
    "title": "查询最后聊天记录",
    "name": "GetMassageStatusByreceiverId",
    "group": "MassageStatus",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sender",
            "description": "<p>发送编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "type",
            "description": "<p>接收类型</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "time",
            "description": "<p>窗口关闭时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>结果数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/messageStatus.js",
    "groupTitle": "MassageStatus"
  },
  {
    "type": "put",
    "url": "/api/messageStatus",
    "title": "修改窗口关闭时间",
    "name": "UpdateTimeByMassageStatus",
    "group": "MassageStatus",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sender",
            "description": "<p>发送编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/messageStatus.js",
    "groupTitle": "MassageStatus"
  },
  {
    "type": "post",
    "url": "/api/messageInform",
    "title": "新建消息通知",
    "name": "AddMessageInform",
    "group": "MessageInform",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "type",
            "description": "<p>类型</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "contents",
            "description": "<p>内容</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskVersion",
            "description": "<p>任务卡版本</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/messageInform.js",
    "groupTitle": "MessageInform"
  },
  {
    "type": "post",
    "url": "/api/progress",
    "title": "保存进程",
    "name": "AddProgress",
    "group": "Progress",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "_id",
            "description": "<p>主键ID</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>文件名</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "process",
            "description": "<p>制作步骤</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "progress",
            "description": "<p>进度百分比</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "startDate",
            "description": "<p>开始时间</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "planDate",
            "description": "<p>预期时间</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "endDate",
            "description": "<p>完成时间</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "creater",
            "description": "<p>创建人{_id:}{name:}</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "auditor",
            "description": "<p>审核人</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "producer",
            "description": "<p>制作人姓名</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "remark",
            "description": "<p>备注</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskVersion",
            "description": "<p>任务卡版本编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/progress.js",
    "groupTitle": "Progress"
  },
  {
    "type": "get",
    "url": "/api/progress/:taskVersion",
    "title": "获取当前任务卡版本进程",
    "name": "GetCurrentProgress",
    "group": "Progress",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskVersion",
            "description": "<p>任务卡版本编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "_id",
            "description": "<p>主键ID</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>文件名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "process",
            "description": "<p>制作步骤</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "progress",
            "description": "<p>进度百分比</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "startDate",
            "description": "<p>开始时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "planDate",
            "description": "<p>预期时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "endDate",
            "description": "<p>完成时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "creater",
            "description": "<p>创建人{_id:}{name:}</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "auditor",
            "description": "<p>审核人</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "producer",
            "description": "<p>制作人姓名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "remark",
            "description": "<p>备注</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskVersion",
            "description": "<p>任务卡版本编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/progress.js",
    "groupTitle": "Progress"
  },
  {
    "type": "post",
    "url": "/api/project",
    "title": "新建项目",
    "name": "AddProject",
    "group": "Project",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>项目名称</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorId",
            "description": "<p>作者编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/project.js",
    "groupTitle": "Project"
  },
  {
    "type": "post",
    "url": "/api/project/addMembers",
    "title": "添加成员",
    "name": "AddProjectMembers",
    "group": "Project",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>项目编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "members",
            "description": "<p>成员编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "job",
            "description": "<p>用户职位</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "moduleId",
            "description": "<p>模块编号（模块添加成员时候需要填写）</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "results",
            "description": "<p>操作结果</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/project.js",
    "groupTitle": "Project"
  },
  {
    "type": "delete",
    "url": "/api/project/delMembers",
    "title": "删除项目成员",
    "name": "DeleteMember",
    "group": "Project",
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "projectId",
            "description": "<p>项目编号</p> "
          },
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "memberId",
            "description": "<p>用户编号</p> "
          },
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "moduleId",
            "description": "<p>模块编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/project.js",
    "groupTitle": "Project"
  },
  {
    "type": "delete",
    "url": "/api/project/:projectId",
    "title": "删除项目",
    "name": "DeleteProject",
    "group": "Project",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "projectId",
            "description": "<p>项目编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/project.js",
    "groupTitle": "Project"
  },
  {
    "type": "get",
    "url": "/api/project/",
    "title": "取得所有项目信息",
    "name": "GetAllProject",
    "group": "Project",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>结果数组·</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/project.js",
    "groupTitle": "Project"
  },
  {
    "type": "get",
    "url": "/api/project/:projectId",
    "title": "取得项目信息",
    "name": "GetProject",
    "group": "Project",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "projectId",
            "description": "<p>项目有编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>项目名称</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "authorId",
            "description": "<p>创建人编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>结果数组·</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/project.js",
    "groupTitle": "Project"
  },
  {
    "type": "get",
    "url": "/api/project/count",
    "title": "查询项目总数",
    "name": "GetProjectCount",
    "group": "Project",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "conditions",
            "defaultValue": "{}",
            "description": "<p>查询条件</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "count",
            "description": "<p>符合条件的通知数</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/project.js",
    "groupTitle": "Project"
  },
  {
    "type": "get",
    "url": "/api/project/queryRole/:projectId",
    "title": "根据项目编号查询用户角色分类",
    "name": "QueryRole",
    "group": "Project",
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "projectId",
            "description": "<p>项目有编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "dbProject",
            "description": "<p>结果·</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/project.js",
    "groupTitle": "Project"
  },
  {
    "type": "put",
    "url": "/api/project",
    "title": "修改",
    "name": "updateProject",
    "group": "Project",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>项目编号</p> "
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "<p>Numeber</p> ",
            "optional": false,
            "field": "status",
            "description": "<p>项目状态 0：开始 1：结束</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "results",
            "description": "<p>更新结果</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/project.js",
    "groupTitle": "Project"
  },
  {
    "type": "post",
    "url": "/api/reviewComment",
    "title": "新建审核信息",
    "name": "AddReviewComment",
    "group": "ReviewComment",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "content",
            "description": "<p>审核意见内容</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "senderId",
            "description": "<p>发送人编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "senderName",
            "description": "<p>发送人姓名</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "stutas",
            "description": "<p>审核状态</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskVersion",
            "description": "<p>任务卡版本编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "creatTime",
            "description": "<p>创建日期</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "_id",
            "description": "<p>审核编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "content",
            "description": "<p>审核意见内容</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "endDate",
            "description": "<p>完成时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "senderId",
            "description": "<p>发送人编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "senderName",
            "description": "<p>发送人姓名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "stutas",
            "description": "<p>审核状态</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskVersion",
            "description": "<p>任务卡版本编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "creatTime",
            "description": "<p>创建日期</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/reviewComment.js",
    "groupTitle": "ReviewComment"
  },
  {
    "type": "get",
    "url": "/api/reviewComment/:taskVersion",
    "title": "获取当前任务卡版本审核意见",
    "name": "GetCurrentReviewComment",
    "group": "ReviewComment",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskVersion",
            "description": "<p>任务卡版本编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "content",
            "description": "<p>审核意见内容</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "senderId",
            "description": "<p>发送人编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "producer",
            "description": "<p>发送人姓名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "stutas",
            "description": "<p>审核状态</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskVersion",
            "description": "<p>任务卡版本编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "creatTime",
            "description": "<p>创建日期</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>审核意见数据</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/reviewComment.js",
    "groupTitle": "ReviewComment"
  },
  {
    "type": "post",
    "url": "/api/reviewComment/save",
    "title": "保存审核信息",
    "name": "SaveReviewComment",
    "group": "ReviewComment",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "content",
            "description": "<p>审核意见内容</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "senderId",
            "description": "<p>发送人编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>senderName</p> ",
            "optional": false,
            "field": "senderName",
            "description": "<p>发送人姓名</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "stutas",
            "description": "<p>审核状态</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskVersion",
            "description": "<p>任务卡版本编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "creatTime",
            "description": "<p>创建日期</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/reviewComment.js",
    "groupTitle": "ReviewComment"
  },
  {
    "type": "get",
    "url": "/api/role",
    "title": "查询权限列表",
    "name": "GetRoleList",
    "group": "Role",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "attributes",
            "description": "<p>查询字段</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "where",
            "description": "<p>查询条件</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Numeber</p> ",
            "optional": true,
            "field": "offset",
            "description": "<p>跳过数据条数</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": true,
            "field": "limit",
            "description": "<p>查询数据条数</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Array</p> ",
            "optional": true,
            "field": "order",
            "description": "<p>排序</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "include",
            "description": "<p>关联</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>通知数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/role.js",
    "groupTitle": "Role"
  },
  {
    "type": "post",
    "url": "/api/plan",
    "title": "新建方案",
    "name": "AddSchema",
    "group": "Schema",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "content",
            "description": "<p>内容</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskVersion",
            "description": "<p>任务卡版本号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/plan.js",
    "groupTitle": "Schema"
  },
  {
    "type": "delete",
    "url": "/api/plan/:schemaId",
    "title": "删除方案",
    "name": "DeleteSchema",
    "group": "Schema",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "schemaId",
            "description": "<p>方案编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/plan.js",
    "groupTitle": "Schema"
  },
  {
    "type": "get",
    "url": "/api/plan/:taskVersion",
    "title": "获取当前任务卡版本方案",
    "name": "GetCurrentSchema",
    "group": "Schema",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskVersion",
            "description": "<p>任务卡版本编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "_id",
            "description": "<p>主键ID</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "content",
            "description": "<p>内容</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskVersion",
            "description": "<p>任务卡版本编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/plan.js",
    "groupTitle": "Schema"
  },
  {
    "type": "post",
    "url": "/api/plan/save",
    "title": "保存方案",
    "name": "SaveSchema",
    "group": "Schema",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "content",
            "description": "<p>内容</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskVersion",
            "description": "<p>任务卡版本号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/plan.js",
    "groupTitle": "Schema"
  },
  {
    "type": "put",
    "url": "/api/plan/:schemaId",
    "title": "修改方案",
    "name": "UpdateSchema",
    "group": "Schema",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "schemaId",
            "description": "<p>通知编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "content",
            "description": "<p>内容</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/plan.js",
    "groupTitle": "Schema"
  },
  {
    "type": "post",
    "url": "/api/user",
    "title": "管理员添加用户",
    "name": "AddUser",
    "group": "User",
    "permission": [
      {
        "name": "0-管理员"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>用户名</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>真实姓名</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "departmentId",
            "description": "<p>所属部门Id</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "level",
            "description": "<p>用户级别</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "_id",
            "description": "<p>用户id</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>用户名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>真实姓名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "departmentId",
            "description": "<p>所属部门Id</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "level",
            "description": "<p>用户级别</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "points",
            "defaultValue": "0",
            "description": "<p>用户积分</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "online",
            "description": "<p>在线状态</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "image",
            "defaultValue": "uploads/defaultAvatar.png",
            "description": "<p>用户头像</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/api/user/:userId",
    "title": "删除用户",
    "name": "DeleteUser",
    "group": "User",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "userId",
            "description": "<p>需要删除的用户id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>删除操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/api/user/:userId",
    "title": "管理员修改用户信息",
    "name": "EditUser",
    "group": "User",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "userId",
            "description": "<p>用户Id</p> "
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "name",
            "description": "<p>真实姓名</p> "
          },
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "label",
            "description": "<p>个人签名</p> "
          },
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "password",
            "description": "<p>密码</p> "
          },
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "image",
            "description": "<p>头像链接</p> "
          },
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "weixin",
            "description": "<p>微信号</p> "
          },
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "email",
            "description": "<p>邮箱</p> "
          },
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "occupationName",
            "description": "<p>职位</p> "
          },
          {
            "group": "body",
            "type": "<p>Date</p> ",
            "optional": true,
            "field": "birthday",
            "description": "<p>生日</p> "
          },
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "departmentId",
            "description": "<p>部门Id</p> "
          },
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "level",
            "description": "<p>用户级别</p> "
          },
          {
            "group": "body",
            "type": "<p>Number</p> ",
            "optional": true,
            "field": "points",
            "defaultValue": "0",
            "description": "<p>用户积分</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>更新操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/api/user/department/:userId",
    "title": "管理员修改用户部门",
    "name": "EditUserDepartment",
    "group": "User",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "params": [
          {
            "group": "params",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "userId",
            "description": "<p>用户Id</p> "
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "departmentId",
            "description": "<p>部门Id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>更新操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/api/user",
    "title": "用户修改自己的信息",
    "name": "EditUserSelf",
    "group": "User",
    "permission": [
      {
        "name": "user"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "name",
            "description": "<p>真实姓名</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "label",
            "description": "<p>个人签名</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "image",
            "description": "<p>头像链接</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "weixin",
            "description": "<p>微信号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "email",
            "description": "<p>邮箱</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "occupationName",
            "description": "<p>职位</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Date</p> ",
            "optional": true,
            "field": "birthday",
            "description": "<p>生日</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "IDCardNumber",
            "description": "<p>身份证号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "account",
            "description": "<p>账户</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>更新操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/user/:userId",
    "title": "取得用户信息",
    "name": "GetUser",
    "group": "User",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "userId",
            "description": "<p>用户Id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "_id",
            "description": "<p>用户id</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>用户名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>真实姓名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "label",
            "description": "<p>个人签名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "image",
            "description": "<p>头像链接</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "weixin",
            "description": "<p>微信号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>邮箱</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "occupationName",
            "description": "<p>职位</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "birthday",
            "description": "<p>生日</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "departmentId",
            "description": "<p>所属部门Id</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "level",
            "description": "<p>用户级别</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "points",
            "defaultValue": "0",
            "description": "<p>用户积分</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "online",
            "description": "<p>在线状态</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "IDCardNumber",
            "description": "<p>身份证号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "account",
            "description": "<p>账户</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/user/byrole",
    "title": "根据角色查询用户",
    "name": "GetUserByRole",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "roles",
            "description": "<p>角色</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "results",
            "description": "<p>用户查询结果</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/user/count",
    "title": "取得用户数",
    "name": "GetUserCount",
    "group": "User",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "conditions",
            "defaultValue": "{}",
            "description": "<p>查询条件</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "count",
            "description": "<p>符合条件的用户数</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/user",
    "title": "取得用户列表",
    "name": "GetUserList",
    "group": "User",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "conditions",
            "defaultValue": "{}",
            "description": "<p>查询条件</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "fields",
            "description": "<p>查询字段</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "options",
            "defaultValue": "{}",
            "description": "<p>查询选项，分页、排序</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "分页请求用户name，image字段:",
          "content": "{\n    conditions: {},\n    fields: \"name image\",\n    options: {skip: 10,limit: 5}\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>用户数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/user/search",
    "title": "按姓名查询用户列表",
    "name": "SearchUserListByName",
    "group": "User",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "name",
            "description": "<p>名字关键字</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>用户数组</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/user/exist",
    "title": "用户是否存在",
    "name": "UserIsExist",
    "group": "User",
    "permission": [
      {
        "name": "0-管理员"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>用户名</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>用户是否存在</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/api/user/login",
    "title": "用户登录",
    "name": "UserLogin",
    "group": "User",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>用户名</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "defaultValue": "true",
            "description": "<p>登录成功</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>User</p> ",
            "optional": false,
            "field": "value",
            "description": "<p>登录用户信息</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sid",
            "description": "<p>sessionId</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "defaultValue": "false",
            "description": "<p>登录失败</p> "
          },
          {
            "group": "401",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "message",
            "description": "<p>登录失败消息</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/api/user/logout",
    "title": "退出登录",
    "name": "UserLogout",
    "group": "User",
    "permission": [
      {
        "name": "all"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "defaultValue": "true",
            "description": "<p>退出成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/api/user/getUserList",
    "title": "获取用户表",
    "name": "getUserList",
    "group": "User",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "projectid",
            "description": "<p>项目id</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "usertype",
            "description": "<p>用户类型</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/api/taskCard/:taskCardId",
    "title": "删除任务卡",
    "name": "DeleteTaskCard",
    "group": "taskCard",
    "permission": [
      {
        "name": "leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskCardId",
            "description": "<p>任务卡编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/taskCard.js",
    "groupTitle": "taskCard"
  },
  {
    "type": "put",
    "url": "/api/taskCard/update-all",
    "title": "修改所有表单信息",
    "name": "EditAllCard",
    "group": "taskCard",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "data",
            "description": "<p>表单数组</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>更新操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/taskCard.js",
    "groupTitle": "taskCard"
  },
  {
    "type": "get",
    "url": "/api/taskCard/:taskId",
    "title": "取得任务信息",
    "name": "GetTask",
    "group": "taskCard",
    "permission": [
      {
        "name": "All"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskId",
            "description": "<p>任务编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>任务名称</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "versions",
            "description": "<p>版本号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "isSend",
            "description": "<p>是否发送</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "status",
            "description": "<p>接收状态</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "fatherId",
            "description": "<p>所属任务编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "startDate",
            "description": "<p>开始时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "planDate",
            "description": "<p>预期时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "endDate",
            "description": "<p>结束时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "senderId",
            "description": "<p>发送人编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收人编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "points",
            "description": "<p>积分</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/taskCard.js",
    "groupTitle": "taskCard"
  },
  {
    "type": "get",
    "url": "/api/taskCard/queryOther/:versionId",
    "title": "根据版本id获取任务卡所有版本",
    "name": "QueryVersionsByOtherVersionId",
    "group": "taskCard",
    "permission": [
      {
        "name": "All"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "versionId",
            "description": "<p>当前版本编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>结果数组</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/taskCard.js",
    "groupTitle": "taskCard"
  },
  {
    "type": "put",
    "url": "/api/taskCard/remark/:taskId'",
    "title": "修改备注",
    "name": "UpdateRemark",
    "group": "taskCard",
    "permission": [
      {
        "name": "all"
      }
    ],
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskId",
            "description": "<p>任务卡编号</p> "
          },
          {
            "group": "body",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "remark",
            "description": "<p>备注信息</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>更新操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/taskCard.js",
    "groupTitle": "taskCard"
  },
  {
    "type": "put",
    "url": "/api/taskCard/:taskId",
    "title": "修改任务信息",
    "name": "UpdateTask",
    "group": "taskCard",
    "permission": [
      {
        "name": "All"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "taskId",
            "description": "<p>任务编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "status",
            "description": "<p>状态</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/taskCard.js",
    "groupTitle": "taskCard"
  },
  {
    "type": "get",
    "url": "/api/taskCard/queryByTaskId",
    "title": "根据所属任务编号查询任务卡",
    "name": "getByFatherId",
    "group": "taskCard",
    "permission": [
      {
        "name": "Leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "fatherId",
            "description": "<p>所属任务编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>结果数组</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/taskCard.js",
    "groupTitle": "taskCard"
  },
  {
    "type": "get",
    "url": "/api/taskCard/queryByReceiverId",
    "title": "根据接收人获取任务卡",
    "name": "getByReceiverId",
    "group": "taskCard",
    "permission": [
      {
        "name": "All"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收人编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>结果数组</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/taskCard.js",
    "groupTitle": "taskCard"
  },
  {
    "type": "get",
    "url": "/api/taskCard/queryByAuditor/:auditorId",
    "title": "根据进程审核人获取任务卡信息",
    "name": "getTaskByAuditor",
    "group": "taskCard",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "auditorId",
            "description": "<p>审核人编号</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>任务名称</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "versions",
            "description": "<p>版本号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "status",
            "description": "<p>接收状态</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "fatherId",
            "description": "<p>所属任务编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "startDate",
            "description": "<p>开始时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "planDate",
            "description": "<p>预期时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "endDate",
            "description": "<p>结束时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "senderId",
            "description": "<p>发送人编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "senderName",
            "description": "<p>发送人姓名</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收人编号</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "progress",
            "description": "<p>进程</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "priority",
            "description": "<p>等级</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "points",
            "description": "<p>积分</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "creatDate",
            "description": "<p>创建时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "updateTime",
            "description": "<p>更新时间</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "index",
            "description": "<p>位置</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "list",
            "description": "<p>任务卡信息</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/taskCard.js",
    "groupTitle": "taskCard"
  },
  {
    "type": "post",
    "url": "/api/taskCard",
    "title": "保存任务卡",
    "name": "saveTaskCard",
    "group": "taskCard",
    "permission": [
      {
        "name": "Leader"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>任务名称</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "versions",
            "description": "<p>版本号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "isSend",
            "description": "<p>是否发送</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "status",
            "description": "<p>接收状态</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "fatherId",
            "description": "<p>所属任务编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "startDate",
            "description": "<p>开始时间</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "planDate",
            "description": "<p>预期时间</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "endDate",
            "description": "<p>结束时间</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "senderId",
            "description": "<p>发送人编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "receiverId",
            "description": "<p>接收人编号</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "points",
            "description": "<p>积分</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "ok",
            "description": "<p>操作是否成功</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "server/src/api/taskCard.js",
    "groupTitle": "taskCard"
  }
] });