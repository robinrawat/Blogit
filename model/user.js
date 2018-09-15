var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');


var userSchema = mongoose.Schema({
	firstName:{
		type:String,
		required: true
	},
	lastName:{
		type:String,
		required: true
	},
	email:{
		type:String,
		required: true
	},
	password:{
		type:String,
		required: true
	},
	confirmPassword:{
		type:String,
		required: true
	},
	create_date:{
		type: Date,
		default: Date.now
	}
});

var User = module.exports = mongoose.model('User',userSchema);

module.exports.addUser=function(user,callback){
	User.create(user,callback);
}