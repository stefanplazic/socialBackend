var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var databaseConfig = require('../databaseconfig');
var User = require('../models/user'); 


/*function for checking if user is logged*/
exports.isLogged = function(req, res, next){
	var token =req.headers['x-access-token'];
	if(!token){
		res.send({success:false,message:'No jwt token provided'});
	}
	else{
		jwt.verify(token, databaseConfig.secretKey,function(err,user){
			if(err){
				
				return res.json({ success: false, msg: 'failed to authenticate' });
			}
			else{
				req.locals = user;
				//console.log(res.locals.user);
				next();
			}
		});
	}
};

/*function for sign in jwt token*/
exports.signIn = function(user){
	var expireTime = 2592000;
	return jwt.sign({ user }, databaseConfig.secretKey, {
      expiresIn: expireTime
    });
}

