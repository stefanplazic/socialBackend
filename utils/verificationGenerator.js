var crypto = require('crypto');

exports.codeGenerator = function(){
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/*function for  createing password hash and generating salt
	returns: hash of the password 
	returns: generated salt for given passwor
*/
exports.generateSaltAndHash = function(userPassword){
	var length = 10;
	 var salt =  crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') 
            .slice(0,length); 
     var hash = crypto.createHmac('sha512', salt);
     hash.update(userPassword);
     var value = hash.digest('hex');
     return {
        salt:salt,
        passwordHash:value
    };
};

/*function for checking password hash*/
exports.checkHash = function(userPassword, userSalt, passwordHash){
	var hash = crypto.createHmac('sha512', userSalt);
	hash.update(userPassword);
	var value = hash.digest('hex');

	if(value === passwordHash)
		return true;
	return false;
};

exports.findHash = function(salt, password){
	var hash = crypto.createHmac('sha512', salt);
	hash.update(password);
	return hash.digest('hex');
};
