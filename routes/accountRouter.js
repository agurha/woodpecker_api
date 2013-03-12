/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 11/03/2013
 * Time: 11:53
 * To change this template use File | Settings | File Templates.
 */
var restify = require("restify");
var User = require("../models/user");
var check = require('validator').check;
var logger = require('../services/loggerService').logger;
var accountService = require('../services/accountService');

exports.registerUser = function (req, res, next) {

  try {
    check(req.params.email, 'Email supplied isnt valid').len(6, 64).isEmail()
    check(req.params.password, 'Password must be atleast 6 characters long').len(6, 64).isAlphanumeric()

  }
  catch (ex) {
    return next(new restify.InvalidCredentialsError(ex.message));

  }

  accountService.registerUser(req.params.email, req.params.password, function (err, user) {

    if (err)
      return next(err);

    res.send(201, user);
  });
}

exports.accountExists = function(req, res, next){

  console.log('email sent is : ' + req.params.email);

  accountService.exists(req.params.email, function(err, user){

    if(err)
      return next(new restify.InvalidCredentialsError('user doesnt exist'));

    res.send(200, user);

  });
}

exports.signinUser = function(req,res, next){

  accountService.login(req.params.email, req.params.password, function(err, user){

    if(err)
      return next(err);


    return res.send(200, user);

  });

}