var nodemailer = require('nodemailer');

var hostInfo = 'http://192.168.56.1:3001/';

// Create a SMTP transport object
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'imgoshare@gmail.com', // generated ethereal user
        pass: 'onion!0502993' // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});

/*function for sending verification emails*/
exports.sendVerification = function (user) {
    var link = hostInfo.host + 'users/verify?username=' + user.username + '&token=' + user.verificationCode;

    let mailOptions = {
        from: '"VidShare" <imgoshare@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: 'Verification link ✔', // Subject line
        html: "Helloo new user! If you just registered to VidShare you - feel free to click on verification <a href=" + link + ">link</a>" // html body
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
};

/*function sending reset password mail*/
exports.resetPassword = function (user) {
    var link = hostInfo.host + 'html/resetPass.html?token=' + user.resetPasswordToken;

    let mailOptions = {
        from: '"ShorTeller 👻" <imgoshare@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: 'Password reset link ✔', // Subject line
        html: "<b>" + user.username + "</b>" + " if you had request password reset - feel free to click on the <a href=" + link + ">link</a> <p>Otherwise just ignore it  😋 </p>" // html body
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
};


