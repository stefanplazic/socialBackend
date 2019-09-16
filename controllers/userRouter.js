var express = require('express');

var Post = require('../models/post');
var User = require('../models/user');
var Notification = require('../models/notification');
var multer = require('multer');
var firebase = require('../utils/firebaseUtil');

var verificationGenerator = require('../utils/verificationGenerator');
var jwtUtil = require('../auth/jwtUtil');
var emailSender = require('../utils/emailUtil');

/*multer settings*/
var destImg = 'public/uploads/avatars';
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
		if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
			return true;
		}
		else {
			return false;
		}
	}
});
var upload = multer({ storage: storage });
/*END OF MULTER*/

var router = express.Router();

router.use('/profileData', jwtUtil.isLogged);
router.use('/follow', jwtUtil.isLogged);
router.use('/unfollow', jwtUtil.isLogged);
router.use('/avatarUpdate', jwtUtil.isLogged);
router.use('/isVerifed', jwtUtil.isLogged);

router
	.post('/login', async function (req, res, next) {
		var username = req.body.username.toLowerCase();
		var password = req.body.password;

		//create token object

		//find the user with given username
		User.findOne({ username: username }, async function (err, user) {
			if (err)
				return next(err);
			if (user == null) {
				res.send({ success: false, message: "Wrong credintionals" });
				return;
			}
			var hashPass = verificationGenerator.findHash(user.salt, password);
			if (hashPass === user.password) {
				var userRes = { username: user.username, email: user.email, _id: user._id };
				res.send({ success: true, jwt: jwtUtil.signIn(user), userData: userRes });
				return;
			}
			res.send({ success: false, message: "Wrong credintionals" });
		});


	})
	.post('/register', async function (req, res, next) {



		try {
			const verificationCode = verificationGenerator.codeGenerator();
			var hashData = verificationGenerator.generateSaltAndHash(req.body.password);
			var newUser = new User(req.body);
			newUser.verified = false;
			newUser.verificationCode = verificationCode;
			newUser.password = hashData.passwordHash;
			newUser.salt = hashData.salt;
			newUser.registrationDate = Date.now();
			newUser.avatar = 'https://firebasestorage.googleapis.com/v0/b/vidshare-b5bb3.appspot.com/o/avatars%2Fman-156584__340.png?alt=media&token=552de123-bb18-443c-8445-d21221e73109';
			const userAdded = await newUser.save();
			res.send({ success: true, message: 'User Registered.' })
			emailSender.sendVerification(userAdded);
		}
		catch (err) {

			res.status(409).send({ success: false, message: err.message });
		}

	})
	.put('/follow/:userId', async function (req, res, next) {
		var userId = req.params.userId;
		var currentUser = req.locals.user;
		try {
			//check if user exist and is not followed by me
			currentUser = await User.findOne({ _id: currentUser._id });
			var userToFollow = await User.findOne({ _id: userId });
			if (!currentUser.following.includes(userId) && !userToFollow.followers.includes(currentUser._id)) {


				userToFollow.followers.push(currentUser._id);
				currentUser.following.push(userId);

				await User.updateOne({ _id: userToFollow._id }, { followers: userToFollow.followers });
				await User.updateOne({ _id: currentUser._id }, { following: currentUser.following });
				res.send({ success: true, user: { avatar: currentUser.avatar, username: currentUser.username, _id: currentUser._id } });

				/*SEND NOTIFICATION */

				var notification = await new Notification({
					creationDate: new Date(),
					sender: currentUser._id,
					receiver: userId,
					notificationType: 'follow',
					content: { 'message': 'started following you' },
					isSeen: false
				}).save();
				//send via socket
				const notId = notification._id;
				notification = await Notification.findById(notId).populate({ path: 'sender' }).exec();
				req.app.get('socketio').emit('notification/' + userId, notification);


			}
			else
				res.status(500).send({ success: false, message: 'Error occured' });
		}
		catch (err) {
			console.log(err);
			res.status(409).send({ success: false, message: err.message });
		}

	})
	/*UNFOLLOW USER*/
	.put('/unfollow/:userId', async function (req, res, next) {
		var userId = req.params.userId;
		var currentUser = req.locals.user;
		try {

			currentUser = await User.findOne({ _id: currentUser._id });
			var userToFollow = await User.findOne({ _id: userId });

			console.log(userToFollow.followers.indexOf(currentUser._id));
			console.log(userToFollow.following.indexOf(userToFollow._id));

			userToFollow.followers.splice(userToFollow.followers.indexOf(currentUser._id), 1);
			currentUser.following.splice(currentUser.following.indexOf(userToFollow._id), 1);

			console.log(userToFollow.followers);
			console.log(currentUser.following);

			await User.updateOne({ _id: userToFollow._id }, { followers: userToFollow.followers });
			await User.updateOne({ _id: currentUser._id }, { following: currentUser.following });
			res.send({ success: true });

		}
		catch (err) {
			console.log(err);
			res.status(409).send({ success: false, message: err.message });
		}

	})

	/*update avatar*/
	.put('/avatarUpdate', upload.single('avatar'), async function (req, res, next) {
		var currentUser = req.locals.user;
		try {

			var avatarPath = await firebase.uploadImage(req.file.path, 'avatars/' + req.file.filename);

			//check if user exist and is not followed by me
			currentUser = await User.findOne({ _id: currentUser._id });
			await User.updateOne({ _id: currentUser._id }, { avatar: avatarPath });
			res.send({ success: true, avatarPath: avatarPath });
		}
		catch (err) {
			console.log(err);
			res.status(409).send({ success: false, message: err.message });
		}

	})


	//get user profile
	.get('/profileData/:userId', async function (req, res, next) {
		var userId = req.params.userId;
		try {
			let result = await User.findOne({ _id: userId })
				.populate({ path: 'following', select: 'username avatar _id' })
				.populate({ path: 'followers', select: 'username avatar _id' })
				.exec();
			result.password = undefined;
			result.salt = undefined;
			let posts = await Post.find({ author: userId, isDeleted: false })
				.sort('-postDate')
				.populate({ path: 'author', select: 'username avatar _id' })
				.populate({ path: 'tags' })
				.exec();

			res.send({ success: true, userData: { result, posts } });
		}
		catch (err) {
			console.log(err);
			res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
		}


	})



	//CHECK IF USERNAME IS available
	.get('/checkname/:username', async function (req, res, next) {

		try {
			let result = await User.find({ username: req.params.username });
			if (result.length == 0)
				result = false;
			else
				result = true;
			res.send({ success: true, exists: result });
		}
		catch (err) {
			console.log(err);
			res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
		}



	})
	//CHECK IF 	EMAIL IS available
	.get('/checkemail/:email', async function (req, res, next) {
		var email = req.params.email;
		if (!(/\S+@\S+\.\S+/.test(email))) {
			res.send({ success: false, message: 'Not valid email format!' });
			return;
		}

		try {
			let result = await User.find({ email: email });
			console.log(result);
			if (result.length == 0)
				result = false;
			else
				result = true;
			res.send({ success: true, exists: result });
		}
		catch (err) {
			console.log(err);
			res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
		}

	})

	//reset password
	.put('/reset/:token', async function (req, res, next) {

		try {
			//find user
			var forgotUser = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
			if (!forgotUser) {
				res.status(404).send({ success: false, message: 'Password reset token is invalid or has expired.' });
				return;
			}


			var newPassword = req.body.newPassword;
			var hashData = verificationGenerator.generateSaltAndHash(newPassword);
			forgotUser.password = hashData.passwordHash;
			forgotUser.salt = hashData.salt;

			forgotUser.resetPasswordToken = undefined;
			forgotUser.resetPasswordExpires = undefined;
			//save user
			forgotUser = await forgotUser.save();

			res.send({ success: true, message: "Password reset was successfull" });
		}
		catch (err) {
			console.log(err);
			res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
		}

	})
	//verify user
	.get('/verify', function (req, res, next) {
		var username = req.query.username;
		var verificationCode = req.query.token;
		User.findOneAndUpdate({ username: username, verificationCode: verificationCode }, { verified: true },
			function (err, success) {
				if (err)
					return next(err);
				//return success message
				res.send({ message: 'success' });
			});
	})
	//set reset password link
	.put('/forgotPassword', async function (req, res, next) {

		try {
			//find user
			var forgotUser = await User.findOne({ email: req.body.email });
			if (!forgotUser) {
				res.status(404).send({ success: false, message: 'No such email' });
				return;
			}

			//if code allready sent and didn't expire
			if (forgotUser.resetPasswordExpires > Date.now()) {
				res.status(409).send({ success: false, message: 'Reset code already sent' });
				return;
			}

			var resetPassToken = verificationGenerator.codeGenerator();
			forgotUser.resetPasswordToken = resetPassToken;
			forgotUser.resetPasswordExpires = Date.now() + 360000;//expires in 10 hours
			//save user
			forgotUser = await forgotUser.save();
			res.send({ success: true, message: "Please check your email" });
			//send email
			emailSender.resetPassword(forgotUser);
		}
		catch (err) {
			console.log(err);
			res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
		}

	})

	.get('/isVerifed', async function (req, res, next) {

		try {
			var currentUser = req.locals.user;
			currentUser = await User.findById(currentUser._id);
			const result = currentUser.verified === true;
			res.send({ success: true, result: result, email: currentUser.email });
			//find user
		}
		catch (err) {
			console.log(err);
			res.status(409).send({ success: false, message: "Something went wrong. Please try again." });
		}

	})

	;

module.exports = router;
