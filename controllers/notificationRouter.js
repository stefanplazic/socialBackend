var express = require('express');

var jwtUtil = require('../auth/jwtUtil');

var Notification = require('../models/notification');

var router = express.Router();

router.use('/list', jwtUtil.isLogged);
router.use('/mark', jwtUtil.isLogged);

router
    .get('/list', async function (req, res, next) {
        const currentUser = req.locals.user;

        try {
            const notifications = await Notification
                .find({ receiver: currentUser._id })
                .sort('-creationDate')
                .populate({ path: 'sender' })
                .exec();

            res.send({ success: true, results: notifications });

        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }


    })

    //delete user post
    .put('/mark/:notId', async function (req, res, next) {
        const currentUser = req.locals.user;
        const notId = req.params.notId;
        try {
            const result = await Notification.findOneAndUpdate({ _id: notId, receiver: currentUser._id }, { $set: { isSeen: true } }, { new: true });
            res.send({ success: true, results: result });

        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }
    })



    ;


module.exports = router;