var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


app.use(express.static(__dirname+'/client'));
app.use(bodyParser.json());

User=require('./model/user');
Blog=require('./model/blog');

var MONGODB_URI = "mongodb://localhost:27017/blog";
// mongoose.connect('mongodb://localhost/bookstore');
// var db = mongoose.connection;
mongoose.connect(MONGODB_URI);
// on successful connection
mongoose.connection.on('connected',()=>{
	console.log('Connected to MongoDB @ 27017');
});
//on connection error
mongoose.connection.on('error',(err)=>{
	if(err){
		console.log('Error in DB connection: ' + err);
	}
});

app.get('/',function(req,res){
	console.log('hey welcome');
});

app.get('/api/blogs/',function(req,res){
	Blog.find( function(err,Blogs){
		if(err){
			throw err;
			res.status(400).send({
				message: "Error occured"
			});
		}else{
			res.status(200).send({
				message:"blogs retrieved",
				blogs:Blogs
			})
		}
	})
})

app.post('/api/blogs/upVote/:_id',function(req,res){
	var id = req.params._id;
	var blog = req.body;
	Blog.updateUpVote(id,blog,{},function(err,blog){
		if(err){
			throw err;
		}
		res.json(blog);
	})
})

app.delete('/api/blogs/:_id',function(req,res){
	var id = req.params._id;
	Blog.deleteBlog(id,function(err,blog){
		if(err){
			throw err;
		}
		res.json(blog);
	})
})

app.post('/api/blogs/downVote/:_id',function(req,res){
	var id = req.params._id;
	var blog = req.body;
	Blog.updateDownVote(id,blog,{},function(err,blog){
		if(err){
			throw err;
		}
		res.json(blog);
	})
})

app.post('/api/blogs/updates/:_id',function(req,res){
	var id = req.params._id;
	var blog = req.body;
	console.log(blog);
	Blog.updateBlog(id,blog,{},function(err,blog){
		if(err){
			throw err;
		}
		res.json(blog);
	});
});

app.get('/api/blogs/ownblog/:author_id',function(req,res){
	Blog.find({author_id:req.params.author_id},function(err,blogs){
		if(err){
			throw err;
			res.status(400).send({
				message: "Error Occured"
			});
		} else {
			if(!blogs.length){
				console.log("Empty array");
				res.status(400).send({
					message: "No blogs"
				});
			} else {
				res.status(200).send({
					message:"Blogs retrieved",
					blogs: blogs
				});
			}
		}
	})
})

app.get('/api/blogs/ownblogs/:_id',function(req,res){
	Blog.getBlogById(req.params._id,function(err,blogs){
		if(err){
			throw err;
			res.status(400).send({
				message: "Error Occured"
			});
		} else {
			res.json(blogs);
		}
	})
})

app.post('/api/blogs',function(req,res){
	var blogs = req.body;
	console.log(blogs);
	Blog.creates(blogs,function(err,blogs){
		if(err){
			throw err;
		}
		
		res.json(blogs);
	})
})

app.post('/api/logins',function(req,res){
	
	User.findOne({email : req.body.email},function(err,user){
		if(user === null){
			return res.status(400).send({
				message:"user not found"
			})
		}
		else{
			if(user.password === req.body.password){
				return res.status(201).send({
					message: "User Logged In",
					displayName: user.firstName + " " + user.lastName,
					id: user.id
				});
			}
			else{
				console.log("wrong password");
				return res.status(400).send({
					message:"wrong Password"
				});
			}
		}
	})
})

app.post('/api/signups',function(req,res){
	var user = req.body;
	
	User.addUser(user,function(err,user){
		if(err){
			throw err;
		}
		res.json(user);
	})
})

app.listen(3030);
console.log('running...');