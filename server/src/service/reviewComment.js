/**
 * Created by doublechang on 2015/12/28.
 */
var ReviewComment = process.core.db.models.ReviewComment;
var User = process.core.db.models.User;
var File = process.core.db.models.File;
var log = process.core.log;
var async = require('async');
var ReviewCommentService = module.exports;

// �½�
ReviewCommentService.create = function(review){
    return ReviewComment.create(review);
};
ReviewCommentService.deleteById = function(fileid){
    return ReviewComment.findById(fileid).then(function (db){
        return db.destroy();
    })
};

ReviewCommentService.getById = function(fileid){
    return ReviewComment.findById(fileid,{
        include:[{
            model:File,
            as:'belongFile'
        }]
    });
};
ReviewCommentService.findByVersionId = function(versionId){
    return ReviewComment.all({
        where:{"taskVersionId":versionId}
    })
};

ReviewCommentService.query = function(progressId){
    return ReviewComment.all({
        include:[{
            model: User,
            as: 'sender'
        },{
            model:File,
            as:'belongFile'
        }],
        order:[["createdAt"]],
        where:{"progressId":progressId}
    });
};


// ��������汾��ѯ
ReviewCommentService.getByTaskVersion = function (id) {
    return ReviewComment.all({
        where:{path:id},
        order: [["createdAt", "ASC"]]
    })
    /*ReviewCommentService.query(
        {
            conditions:{
                taskVersion: id
            },
            options:{sort:{"creatTime":1}}
        },callback);*/
};

// �޸�
ReviewCommentService.updateById = function (id, review, callback) {
    return ReviewComment.findOne({
        where: {id: id}
    }).then(function(data){
        return data.update(review);
    });
    /*ReviewComment.findOne({_id: id}, function(err,dbReview){
        if (err) {
            return callback(err);
        }
        for (var key in review) {
            if (review.hasOwnProperty(key)) {
                dbReview[key] = review[key];
            }
        }
        dbReview.save(callback);
    });*/
};

// ���������Ϣ
ReviewCommentService.updateAndCreate = function(review,callback){
    if(review.id){
        return ReviewCommentService.updateById(review.id,review);
    }
    else{
        return ReviewCommentService.create(review);
    }
};


