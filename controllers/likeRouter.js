var express = require('express');

var jwtUtil = require('../auth/jwtUtil');
var Post = require('../models/post');
var Like = require('../models/like');
var Notification = require('../models/notification');

var router = express.Router();

router.use('/', jwtUtil.isLogged);
router.use('/like', jwtUtil.isLogged);
router.use('/unlike', jwtUtil.isLogged);

router
    .post('/like/:postId', async function (req, res, next) {
        const currentUser = req.locals.user;
        const postId = req.params.postId

        try {
            //check if user liked it already
            const like = await Like.find({ author: currentUser._id, post: postId });
            if (like.length > 0) {
                res.status(409).send({ success: false, message: "Allready liked" });
                return;
            }
            //check if post exitsts
            var post = await Post.findOne({ _id: postId, isDeleted: false });
            if (post.length == 0) {
                res.status(404).send({ success: false, message: "Error" });
                return;
            }
            await new Like({ post: postId, author: currentUser._id }).save();
            //get all likes with count
            const likeNum = await Like.count({ post: postId });
            res.send({ success: true, result: likeNum });
            // and save them to post model
            await Post.updateOne({ _id: postId }, { likeNum: likeNum });

            //create notificaton and send via socket
            if (!mongoose.Types.ObjectId(currentUser._id).equals(mongoose.Types.ObjectId(post.author))) {
                var notification = await new Notification({
                    creationDate: new Date(),
                    sender: currentUser._id,
                    receiver: post.author,
                    notificationType: 'like',
                    content: { 'postId': postId },
                    isSeen: false
                }).save();
                console.log(post.author);
                const notId = notification._id;
                notification = await Notification.findById(notId).populate({ path: 'sender' }).exec();
                //send via socket
                req.app.get('socketio').emit('notification/' + post.author, notification);

            }

        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }


    })

    //delete user post
    .delete('/unlike/:postId', async function (req, res, next) {
        var currentUser = req.locals.user;
        var postId = req.params.postId;
        //select post and set isDeleted:true
        try {
            await Like.find({ post: postId, author: currentUser._id }).remove().exec();
            const likeNum = await Like.count({ post: postId });
            await Post.updateOne({ _id: postId }, { likeNum: likeNum });

            res.send({ success: true, result: likeNum });

        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }
    })

    /*GET ALL LIKES FOR GIVEN POST*/
    .get('/:postId', async function (req, res, next) {
        var currentUser = req.locals.user;
        var postId = req.params.postId;
        //select post and set isDeleted:true
        try {
            const likes = await Like.find({ post: postId })
                .populate({ path: 'author', select: 'username avatar _id' })
                .exec();
            const userLiked = await Like.find({ author: currentUser._id, post: postId });
            res.send({ success: true, results: { userLiked, likes } });

        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }
    })

    ;


module.exports = router;