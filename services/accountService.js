/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 08/03/2013
 * Time: 10:48
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var logger = require('./loggerService').logger;
var restify = require("restify");
var uuid = require("node-uuid");
var config = require('config');
var User = require("../models/user");

exports.registerUser = function (email, password, next) {
  // create a user a new user
  var newUser = new User({
    email: email,
    password: password
  });

// save user to database
  newUser.save(function (err) {

    if (err) throw err;

    // fetch user and test password verification
    User.findOne({ email: email }, function (err, user) {

      if (err) throw err;

      // test a matching password
      user.comparePassword(password, function (err, isMatch) {
        if (err) throw err;

      });

    });
    return next(null, newUser.toObject());
  });

};

exports.exists = function (email, next) {

  User.findOne({email: email}, function (err, user) {

    console.log('inside service email is :' + email);

    if (err) {

      console.error('error is :' + err);

      throw err;

    }

    return next(null, user);

  });
};

exports.findUserById = function (id, next) {

  User.findOne({ _id: id }, function (err, user) {
    if (err || !user) {
      return next(new restify.InvalidCredentialsError('Could not find user with id: ' + id));
    }
    return next(null, user);


  })
};


exports.login = function (email, password, next) {

  User.findOne({email: email}, function (err, user) {

    if (err || !user) {

      console.log('going to throw invalid creds');
      return next(new restify.InvalidCredentialsError('Email or password entered incorrect'));
    }

    bcrypt.compare(password, user.password, function (err, isMatch) {

      if (!isMatch)
        return next(new restify.InvalidCredentialsError('Email or password entered incorrect'));

      return next(null, user);
    });

  })
};

//exports.resetPassword = function (email, next) {
//
//  return this.findUserByEmail(email, function (err, user) {
//    var reset_hash, reset_link;
//    if (err || !user) {
//      logger.error("resetPassword - Could not find user");
//      logger.error(err);
//      return next(err, null);
//    } else {
//      reset_hash = uuid.v4();
//      redis.setex("reset:" + reset_hash, 1800, user._id);
//      reset_link = "" + config.mail.host + "/account/reset/" + reset_hash;
//      return mailService.sendForgotPasswordMail(user.email, user.firstname, user.lastname, reset_link, function (err, response) {
//        if (err) {
//          logger.error(err);
//          logger.error(response);
//          return next(err);
//        }
//        return next(null);
//      });
//    }
//  });
//};
//
//exports.findUserByResetHash = function (reset_hash, next) {
//  return redis.get("reset:" + reset_hash, function (err, user_id) {
//    if (err) {
//      logger.error('Couldnt find user for reset_hash: ' + reset_hash);
//      logger.error(err);
//      return next(new restify.NotFoundError('Error when getting user from reset hash'));
//    }
//    if (user_id == null) {
//      return next(new restify.NotFoundError('Invalid or expired reset link'));
//    }
//    return next(null, user_id);
//  });
//};
//
//exports.changePassword = function (user_id, password, next) {
//  return this.cryptPassword(password, function (err, hash) {
//    if (err) {
//      return next(err);
//    }
//    return _updateUser(user_id, {
//      password: hash
//    }, function (err, user) {
//      if (err) {
//        return next(err);
//      }
//      return next(null, user);
//    });
//  });
//};
//
//exports.cryptPassword = function (password, next) {
//  if (password.length < 6) {
//    return next(new restify.InvalidCredentialsError('Password must be at least 6 letters long'));
//  }
//  return bcrypt.genSalt(10, function (err, salt) {
//    if (!err) {
//      return bcrypt.hash(password, salt, function (err, hash) {
//        if (err) {
//          logger.error("cryptPassword - Failed to hash password");
//          return next(err);
//        } else {
//          logger.info("cryptPassword - Hashed password to: " + hash);
//          return next(null, hash);
//        }
//      });
//    }
//  });
//};
//
//exports.validatePassword = function (email, password, next) {
//  return this.findUserByEmail(email, function (err, user) {
//    if (err || !user) {
//      logger.info("validatePassword - Could not find user");
//      logger.error(err);
//      return next(err, null);
//    } else {
//      return bcrypt.compare(password, user.password, function (err, isPasswordMatch) {
//        if (!isPasswordMatch) {
//          logger.info("validatePassword - Password does not match for user : " + user.email);
//          return next(new restify.InvalidCredentialsError("Incorrect password"), null);
//        } else {
//          logger.info("validatePassword - Authentication succeed for user : " + user.email);
//          return next(null, user);
//        }
//      });
//    }
//  });
//};
//
//exports.findUserByEmail = function (email, next) {
//
//  return User.findOne({
//    email: new RegExp("^" + email + "$", "i")
//  }, function (err, user) {
//    if (err) {
//      logger.error('findUserByEmail - error');
//      return next(new restify.RestError('Error finding user'));
//    } else if (!user) {
//      logger.error("findUserByEmail - Cannot find user for Email: " + email);
//      return next(new restify.InvalidCredentialsError('No user found with that email (' + email + ')'));
//    } else {
//      logger.info("findUserByEmail - Found user: " + user.email + " for Email:" + email);
//      return next(null, user);
//    }
//  });
//};
//
//exports.updateUser = function (user_id, update, next) {
//  if (update.plan != null) {
//    return Plan.findOne({
//      type: update.plan
//    }, function (err, plan) {
//      if (err) {
//        logger.error(err);
//        return next(err);
//      }
//      update.plan = plan._id;
//      return _updateUser(user_id, update, next);
//    });
//  } else {
//    return _updateUser(user_id, update, next);
//  }
//};
//
//_updateUser = function (user_id, update, next) {
//  return User.findByIdAndUpdate(user_id, update, function (err, user) {
//    if (err || !user) {
//      logger.error(err);
//      logger.error("Could not update user: " + user);
//      return next(err);
//    } else {
//      logger.info('Updated User: ' + user);
//      return next(null, user);
//    }
//  });
//};
//
//
//exports.findUserByApiKey = function (apikey, next) {
//  return User.findOne({
//    api_key: apikey
//  }, function (err, user) {
//    if (err || !user) {
//      logger.info("findUserByApiKey - Cannot find user with apikey: " + apikey);
//      return next(new restify.NotAuthorizedError("Invalid api key"), null);
//    } else {
//      return next(null, user);
//    }
//  });
//};
//
//exports.login = function (id, next) {
//  return this.findUserById(id, function (err, user) {
//    if (!user) {
//      return logger.info("login - Cannot found user for Id: " + id);
//    } else {
//      logger.info("login - Found user: " + user.email + " for Id: " + id);
//      return next(err, user);
//    }
//  });
//};






