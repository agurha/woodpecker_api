/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 10/03/2013
 * Time: 13:27
 * To change this template use File | Settings | File Templates.
 */

var request = require('supertest');
var assert = require('assert');
var should = require('should');
var mocha = require('mocha');
var http = require('http');
var mongoose = require('mongoose');
var User = require('../models/user');


var server = require('../app');

describe('Server', function () {

  describe('GET /get-data', function () {

    it('ping responds with OK', function (done) {

      request(server)
        .get('/ping')
        .end(function (err, res) {

          assert.equal(err, null);

          var body = res.body;

          assert.equal(body, 'OK');

          done();

        });

    });

  });

  describe('GET /', function () {

    it('responds with default message', function (done) {

      request(server)
        .get('/')
        .end(function (err, res) {

          assert.equal(err, null);

          res.should.have.status(200);

          res.text.should.equal('Welcome to API Server');

          done();


        });

    });
  });

  describe('POST /user', function () {

    it('fails to put new user as email not supplied', function (done) {

      request(server)
        .post('/user/signup')
        .send({password: 'samsung'})
        .end(function (err, res) {

          res.should.have.status(401);

          res.text.should.include('Email supplied isnt valid');

          done();
        });
    });

    it('fails to put new user as password not supplied', function (done) {

      request(server)
        .post('/user/signup')
        .send({email: 'ankur.gurha@gmail.com'})
        .end(function (err, res) {

          res.should.have.status(401);

          res.text.should.include('Password must be atleast 6 characters long');

          done();
        });
    });


    it('fails to put new user as email supplied not valid', function (done) {

      request(server)
        .post('/user/signup')
        .send({email: '', password: 'samsung'})
        .end(function (err, res) {

          res.should.have.status(401);

          res.text.should.include('Email supplied isnt valid');

          done();
        });
    });


    it('fails to put new user as email supplied not valid', function (done) {

      request(server)
        .post('/user/signup')
        .send({email: 'ankur@ankur', password: 'samsung'})
        .end(function (err, res) {

          res.should.have.status(401);

          res.text.should.include('Email supplied isnt valid');

          done();
        });
    });

    it('fails to put new user as password not long enough', function (done) {

      request(server)
        .post('/user/signup')
        .send({email: 'ankur.gurha@gmail.com', password: 'sam'})
        .end(function (err, res) {

          res.should.have.status(401);
          res.text.should.include('Password must be atleast 6 characters long');

          done();
        });

    });

    it('puts a new user in mongo db', function (done) {

      request(server)
        .post('/user/signup')
        .send({email: 'ankur.gurha@gmail.com', password: 'samsung'})
        .end(function (err, res) {

          assert.equal(err, null);

          res.should.have.status(201);

          done();

        });

    });

    it('finds the user in mongodb', function (done) {

      request(server)
        .post('/user/exists')
        .send({email: 'ankur.gurha@gmail.com'})
        .end(function (err, res) {

          should.not.exist(err);
          should.exist(res);


          res.should.be.a('object');

          res.text.should.not.be.empty;

          done();

        });

    });


    it('cannot find the user in mongodb', function (done) {

      request(server)
        .post('/user/exists')
        .send({email: 'ankur@gmail.com'})
        .end(function (err, res) {

          should.not.exist(err);

          console.log(res.text);

          res.text.should.be.empty;

          done();

        });

    });

    it('should be able to signin with good user creds', function(done){

      request(server)
        .post('/user/signin')
        .send({email: 'ankur.gurha@gmail.com', password: 'samsung'})
        .end(function(err, res){

          should.not.exist(err);
          res.should.have.status(200);

          done();

        });

    });


    it('should  not be able to signin with bad user creds', function(done){

      request(server)
        .post('/user/signin')
        .send({email: 'ankur.gurha@gmail.com', password: 'samsung1'})
        .end(function(err, res){

          console.log('inside test err is :' + err);

          console.log('inside test res is : ' + res.body);

          res.should.have.status(401);

          done();

        });

    });

    // All test finished

  });


  after(function (done) {
    mongoose.connection.collections['users'].drop();
    mongoose.connection.close(done);
  });

});



