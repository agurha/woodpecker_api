/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 08/03/2013
 * Time: 08:24
 * To change this template use File | Settings | File Templates.
 */

var config = require('config');
var restify = require('restify');
var path = require('path');
var passport = require('passport');
var lodash = require('lodash');
var validate = require('validator').check;
var sanitize = require('validator').sanitize;
var async = require('async');
var mongoose = require('./services/dbConnService');
var fs = require('fs');

var server = module.exports = restify.createServer({
  name: 'api',
  version: '0.0.1'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.jsonp());

server.use(passport.initialize());

server.on('MethodNotAllowed', function(req, res) {
//  logger.error('Method Not Allowed error');
  return res.send(405);
});

server.on('VersionNotAllowed', function(req, res) {
//  logger.error('Version Not Allowed error');
  return res.send(505);
});

server.on('uncaughtException', function(req, res, route, err) {
//  logger.error("error: " + err);
  return res.send(500);
});

require('./routes')(server);

var server = server.listen(config.node.port);

process.on('SIGINT', function() {
  server.close();
  return process.exit();
});

console.log("API is listening on port"+  ":" + config.node.port);
//logger.info("=====API listening on port : " + config.node.port + "=====");
