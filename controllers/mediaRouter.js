var express = require('express');
var jwtUtil = require('../auth/jwtUtil');
var multer = require('multer');
var firebase = require('../utils/firebaseUtil');

var router = express.Router();

router.use('/upload', jwtUtil.isLogged);

/*multer settings*/
var destImg = 'public/uploads/videos';
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, destImg)
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    },
    limits: {
        files: 1,
        fileSize: 5
    },
    onFileUploadStart: function (file) {
        if (file.mimetype == 'video/mp4') {
            return true;
        }
        else {
            return false;
        }
    }
});
var upload = multer({ storage: storage });
/*END OF MULTER*/

router
    .post('/upload', upload.single('video'), async function (req, res, next) {


        try {

            var videoPath = await firebase.uploadVideo(req.file.path, 'videos/' + req.file.filename);
            res.send({ success: true, videoPath: videoPath });
        }
        catch (err) {
            console.log(err);
            res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
        }
    })

    ;

module.exports = router;