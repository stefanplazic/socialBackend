var express = require('express');
var mongoose = require('mongoose');

var jwtUtil = require('../auth/jwtUtil');
var Post = require('../models/post');
var Comment = require('../models/comment');
var Notification = require('../models/notification');


var router = express.Router();

router.use('/create', jwtUtil.isLogged);
router.use('/bypost', jwtUtil.isLogged);
router.use('/byuser', jwtUtil.isLogged);

router
    .post('/create', async function (req, res, next) {
        var currentUser = req.locals.user;
        var newComment = new Comment(req.body.comment);
        newComment.creationDate = Date.now();
        newComment.author = currentUser._id;

        try {
            //require content not empty
            if (newComment.content.length == 0) {
                res.send({ success: false, message: "Comment can't be empty!" });
                return;
            }

            let postResult = await Post.findById(newComment.post);
            if (postResult !== null) {
                postAuthor = postResult.author;
                let result = await newComment.save();
                result = await Comment.findById(result._id).populate({ path: 'author', select: 'username avatar _id' }).exec();



                if (!mongoose.Types.ObjectId(currentUser._id).equals(mongoose.Types.ObjectId(postAuthor))) {
                   
                    var notification = await new Notification({
                        creationDate: new Date(),
                        sender: currentUser._id,
                        receiver: postAuthor,
                        notificationType: 'comment',
                        content: { 'postId': postResult._id, 'comment': { '_id': result._id, 'content': result.content } },
                        isSeen: false
                    }).save();
                    const notId = notification._id;
                    notification = await Notification.findById(notId).populate({ path: 'sender' }).exec();


                    //send via socket
                    req.app.get('socketio').emit('notification/' + postAuthor, notification);

                }
                res.send({ success: true, result: result });


            }
            else
                res.send({ success: false, message: 'No such post Id!' });
        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }


    })

    .get('/bypost/:postId', async function (req, res, next) {
        var postId = req.params.postId;

        try {
            let result = await Comment.find({ post: postId }).populate({ path: 'author', select: 'username avatar _id' }).exec();
            res.send({ success: true, results: result });
        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }

    })

    /*get all comments by user*/
    .get('/byuser/:userId', async function (req, res, next) {
        var userId = req.params.userId;

        try {
            let result = await Comment.find({ author: userId }).populate({ path: 'author', select: 'username avatar _id' }).exec();
            res.send({ success: true, results: result });
        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }

    })

    /*delete comment*/
    .delete('/:commentId', async function (req, res, next) {
        var commentId = req.params.commentId;
        var currentUser = req.locals.user;
        try {
            let result = await Comment.find({ _id: commentId });
            if (result.length != 1 || result.author != currentUser._id) {
                res.status(409).send({ success: false, message: "Error occured" });
                return;
            }
            await Comment.remove({ _id: commentId })
            res.send({ success: true });
        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }

    })
    ;



module.exports = router;