/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 08/03/2013
 * Time: 08:36
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose');
var config = require('config');
var logger = require('./loggerService').logger;

logger.info('connect to: ' + ("mongodb://" + config.mongo.user + ":" + config.mongo.pwd + "@" + config.mongo.host + ":" + config.mongo.port + "/" + config.mongo.dbName));

mongoose.connect("mongodb://" + config.mongo.user + ":" + config.mongo.pwd + "@" + config.mongo.host + ":" + config.mongo.port + "/" + config.mongo.dbName);

mongoose.connection.on('error', function(err) {
  logger.error('MongoDB error');
  return logger.error(err);
});

module.exports = mongoose;
