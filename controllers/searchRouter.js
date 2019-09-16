var express = require('express');

var jwtUtil = require('../auth/jwtUtil');
var Tag = require('../models/tag');
var Post = require('../models/post');
var User = require('../models/user');
var mongoose = require('mongoose');

const perPage = 6;

var router = express.Router();

router.use('/create', jwtUtil.isLogged);
router.use('/posts', jwtUtil.isLogged);
router.use('/tag', jwtUtil.isLogged);

router

    /*SEARCH USERS */
    .get('/users/:username', async function (req, res, next) {
        var regexp = new RegExp("^" + req.params.username.toLowerCase());
        try {
            let result = await User.find({ username: regexp }).select('username avatar _id');
            res.send({ success: true, results: result });

        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }
    })

    /*SEARCH TAGS AND RETURN NUMBER OF POSTS FOR THEM */
    .get('/tag/:tagname', async function (req, res, next) {
        var regexp = new RegExp("^" + req.params.tagname.toLowerCase());
        try {
            let result = await Tag.find({ name: regexp }).sort('-postsNum');
            res.send({ success: true, results: result });

        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }
    })

    /*SEARCH TAGS AND RETURN NUMBER OF POSTS FOR THEM */
    .get('/posts/:tagname/:pageNumber', async function (req, res, next) {
        var tagname = req.params.tagname;
        var pageNumber = req.params.pageNumber * perPage;

        try {
            let tag = await Tag.findOne({ name: tagname });
            if (tag === null) {
                res.send({ success: false });
                return;
            }
            
            let result = await Post.find({ tags: mongoose.Types.ObjectId(tag._id) })
                .sort('-likeNum')
                .sort('-creationDate')
                .skip(pageNumber)
                .limit(perPage)
                .populate({ path: 'author', select: 'username avatar _id' })
                .populate({ path: 'tags'})
                .exec();
    
            res.send({ success: true, results: result });

        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }
    })


    ;



module.exports = router;