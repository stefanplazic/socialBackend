var express = require('express');

var jwtUtil = require('../auth/jwtUtil');
var Post = require('../models/post');
var User = require('../models/user');
var Tag = require('../models/tag');

var router = express.Router();

router.use('/create', jwtUtil.isLogged);
router.use('/update', jwtUtil.isLogged);
router.use('/remove', jwtUtil.isLogged);
router.use('/view', jwtUtil.isLogged);
router.use('/latest', jwtUtil.isLogged);
router.use('/following', jwtUtil.isLogged);

const perPage = 6;

router
    .post('/create', async function (req, res, next) {
        var currentUser = req.locals.user;
        var newPost = new Post(req.body.post);
        newPost.creationDate = Date.now();
        newPost.author = currentUser._id;
        newPost.isDeleted = false;
        const myTags = req.body.post.tags;

        try {
            let newTags = [];
            for (let index = 0; index < myTags.length; index++) {
                const element = myTags[index];
                var tagResult = await Tag.findOne({ name: element });
                if (tagResult === null) {
                    tagResult = await new Tag({ name: element }).save();
                }
                else {
                    tagResult.postsNum++;
                    tagResult.save();
                }

                //var tagResult = await Tag.findOrCreate({ name: element });
                newTags.push(tagResult._id);

            }

            newPost.tags = newTags;
            //check if tags exist
            let result = await newPost.save();
            result = await Post.findById(result._id)
                .populate({ path: 'author', select: 'username avatar _id' })
                .populate({ path: 'tags', select: 'name _id' })
                .exec();
            res.send({ success: true, post: result });

            //emit event in socket.io to his followers
            socket = req.app.get('socketio');
            currentUser = await User.findById(currentUser._id);
            currentUser.followers.forEach(userId => {
                socket.emit('home/' + userId, result);
            });
            //emit to him self
            socket.emit('home/' + currentUser._id, result)


        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }


    })
    .put('/update/:postId', async function (req, res, next) {
        var currentUser = req.locals.user;
        var postId = req.params.postId;

        try {
            let post = await Post.findById(postId);
            if (post != null && post.author == currentUser._id) {

                var options = req.body.post;
                var myPost = await Post.findOneAndUpdate({ _id: postId }, options, { new: true }).populate({ path: 'author', select: 'username avatar _id' }).exec();

                res.send({ success: true, post: myPost });

            }

            else
                res.status(404).send({ success: false, message: "Not found" });
        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }

    })
    .get('/view', async function (req, res, next) {
        var postId = req.query.postId;
        try {
            let result = await Post.findById(postId).populate({ path: 'author', select: 'username avatar _id' }).exec();
            if (result != null && !result.isDeleted) {
                res.send({ success: true, post: result });
            }

            else
                res.status(404).send({ success: false, message: "Post doesn't exist." });

        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }


    })

    //delete user post
    .delete('/remove/:postId', async function (req, res, next) {
        var currentUser = req.locals.user;
        var postId = req.params.postId;
        //select post and set isDeleted:true
        try {
            var post = await Post.find({ author: currentUser._id, _id: postId });
            if (post == null) {
                res.status(404).send({ success: false });
                return;
            }

            var options = { isDeleted: true };
            await Post.findOneAndUpdate({ _id: postId }, options)

            res.send({ success: true });

        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }
    })

    /*GET LATEST POSTS */
    .get('/latest/:pageNumber', async function (req, res, next) {
        pageNumber = req.params.pageNumber * perPage;

        try {
            var post = await Post.find({ isDeleted: false })
                .sort('-likeNum')
                .sort('-creationDate')
                .skip(pageNumber)
                .limit(perPage)
                .populate({ path: 'author', select: 'username avatar _id' })
                .populate({ path: 'tags', select: 'name _id' })
                .exec();
            res.send({ success: true, posts: post });
        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }
    })

    /*GET FOLLOWING  POSTS */
    .get('/following/:pageNumber', async function (req, res, next) {
        pageNumber = req.params.pageNumber * perPage;
        var currentUser = req.locals.user;
        try {
            currentUser = await User.findById(currentUser._id);
            //push id so  current user can see his posts too
            currentUser.following.push(currentUser._id);
            var post = await Post.find({ isDeleted: false, author: { $in: currentUser.following } })
                .sort('-creationDate')
                .skip(pageNumber)
                .limit(perPage)
                .populate({ path: 'author', select: 'username avatar _id' })
                .populate({ path: 'tags', select: 'name _id' })
                .exec();
            res.send({ success: true, posts: post });
        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }
    })
    ;



module.exports = router;