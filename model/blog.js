var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');


var blogSchema = mongoose.Schema({
	author_id : {
		type: String,
		required: true
	},
	content:{
		type: String,
		required: true
	},
	title: String,
	upVoteCount : Number,
	downVoteCount : Number,
	create_date:{
		type: Date,
		default: Date.now
	}
});

var Blog = module.exports = mongoose.model('Blog',blogSchema);

module.exports.creates=function(blog,callback){
	Blog.create(blog,callback);
}

module.exports.getBlogById = function(id,callback){
	Blog.findById(id,callback);
}

module.exports.updateBlog = function(id,blog,options,callback){
	var query = {_id: id};
	var update ={
		title:blog.title,
		content:blog.content,
	}
	Blog.findOneAndUpdate(query,update,options,callback);
}

module.exports.updateUpVote = function(id,blog,options,callback){
	var query = {_id: id};
	var update ={
		upVoteCount:blog.upVoteCount+1
	}
	Blog.findOneAndUpdate(query,update,options,callback);
}

module.exports.updateDownVote = function(id,blog,options,callback){
	var query = {_id: id};
	var update ={
		downVoteCount:blog.downVoteCount+1
	}
	Blog.findOneAndUpdate(query,update,options,callback);
}

module.exports.deleteBlog = function(id,callback){
	query = {_id : id};
	Blog.remove(query,callback);
}