var admin = require('firebase-admin');

var serviceAccount = require('../vidshare-b5bb3-firebase-adminsdk-nq8uc-820219f93f.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://vidshare-b5bb3.firebaseio.com',
	storageBucket: "gs://vidshare-b5bb3.appspot.com/"
});


/*upload video to storage*/

exports.uploadVideo = async function (vdeoUrl, name) {
	var videoStorage = admin.storage().bucket();
	await videoStorage.upload(vdeoUrl, { destination: name });
	url = await videoStorage.file(name).getSignedUrl({
		action: 'read',
		expires: '03-09-2491'
	});
	return url[0];
};

exports.uploadImage = async function (imageUrl, name) {
	var imageStorage = admin.storage().bucket();
	await imageStorage.upload(imageUrl, { destination: name });
	url = await imageStorage.file(name).getSignedUrl({
		action: 'read',
		expires: '03-09-2491'
	});
	return url[0];
};