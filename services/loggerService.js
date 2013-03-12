/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 08/03/2013
 * Time: 08:07
 * To change this template use File | Settings | File Templates.
 */


var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new winston.transports.File({ filename: 'logs/all.log' })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/error.log' })
  ]
});

exports.logger = logger;
