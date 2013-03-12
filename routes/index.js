/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 08/03/2013
 * Time: 08:42
 * To change this template use File | Settings | File Templates.
 */

var passport = require('passport');
var restify = require('restify');
var util = require('util');
var logger = require('../services/loggerService').logger;
var home = require('./homeRouter');

var accountRouter = require('./accountRouter');

var router = function (app) {

  logger.info('we got to router');

  app.get('/', home.index);
  app.get('/ping', function (req, res) {
    console.log('came here');
    return res.json('OK');
  });

  app.post('/user/signup', accountRouter.registerUser);
  app.post('/user/exists', accountRouter.accountExists);

  app.post('/user/signin', accountRouter.signinUser);


}

module.exports = router;

//app.get('/user/:id', accountRouter.findUser);
//app.post('/user/authenticate', accountRouter.authenticateUser);
//app.post('/user/reset', accountRouter.resetPassword);
//app.post('/user/reset_password', accountRouter.getUserFromResetHash);
//app.post('/user/:reset_hash/reset_password', accountRouter.changePassword);
//app.post('/user/update_password', accountRouter.updatePassword);
