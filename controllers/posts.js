const Post = require('../models/post');

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
        res.status(201)
            .json({
                message: 'تمت إضافة المشاركة بنجاح', 
                post: {
                    ...createdPost,
                    id: createdPost._id
                }

            });
    }).catch(error => {
        res.status(500).json({
            message: 'فشل إنشاء منشور'
        });
    });
}

exports.updatePost = (req, res, next) =>{
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
        if (result.n > 0) {
            res.status(200).json({message: 'تم التحديث بنجاح'});
        } else {
            res.status(401).json({message: 'لا توجد مصادقة'});
        }
    }).catch(error => {
        res.status(500).json({
            message: 'لا يمكن تحديث المنشور'
        });
    })
}

exports.getPosts = (req, res, next) => {
    const  pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents;
            return Post.count();
        }).then(count => {
            res.status(200).json({
                message: 'تم استدعاء المشاركات بنجاح',
                posts: fetchedPosts,
                maxPosts: count
            }); 
        }).catch(error => {
            res.status(200).json({
                message: 'فشل استدعاء المشاركات'
            });
        });
}

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message: 'المشاركة غير متاحة'});
        }
    }).catch(error => {
        res.status(200).json({
            message: 'فشل استدعاء المشاركة'
        });
    });
}

exports.removePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
        if (result.n > 0) {
            res.status(200).json({message: 'تم الحذف'});
        } else {
            res.status(401).json({message: 'لا توجد مصادقة'});
        }
    }).catch(error => {
        res.status(200).json({
            message: 'فشل حذف المشاركة'
        });
    });
}