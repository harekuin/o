var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/register',function(req,res){
	res.render('register');
});

router.get('/login',function(req,res){
	res.render('login');
});

//getting all the information submitted in register page
router.post('/register',function(req,res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.user;
	var password = req.body.pwd;
	var password2 = req.body.pwd_c;
	var errors = req.validationErrors();

User.find({$or:[{'username': username}, {'email': email}]}, function(err, user){
	if (err){
		console.log('Signup error');
		return done(err);
	}

	 if(user.length!=0){  //if user exists
	 	if(user[0].username==username){
	 		console.log('Username already exists, username: '+username);
	 		req.flash('error_msg', 'This username is already in use. Please pick another username');
			res.redirect('/users/register');
	 	}else if(user[0].email==email && user[0].username==username){
	 		req.flash('error_msg','Both email and username are already in use. Please pick something else');
	 		res.redirect('/users/register');
	 	}else if(user[0].email==email){
	 		console.log('Email is already in use, email: '+email);
	 		req.flash('error_msg', 'This email is already in use. Please pick another email');
			res.redirect('/users/register');
	 	}

	}else{
	var newUser = new User({
		name:name,
		username:username,
		email:email,
		password:password
	});

	User.createUser(newUser, function(err, user){
		if(err){
			throw err;
			console.log(user);
		}});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

});

module.exports =router;