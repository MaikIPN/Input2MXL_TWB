'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var convertInput = require('./thread-input.js');
var convertgpg = require('./thread-gpg.js');
var ftpOUT = require('./thread-ftpOUT.js');
var ftpIN = require('./thread-ftpIN.js');
var scanInput = require('./thread-scan-input.js');
var scangpg = require('./thread-scan-gpg.js');
var scanFTPin = require('./thread-scan-ftpIN.js');
var scanFTPout = require('./thread-scan-ftpOUT.js');
var stopThread = require('./stop-threads.js');
var path = require('./config-files');

var app = express();

app.get('/', function(req,res){
    res.status(200).send('server-files activate!!');
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({extended: false}));

app.use('/input',convertInput);
app.use('/ftpout',ftpOUT);
app.use('/ftpin',ftpIN);

app.use('/scanftpOUT',scanFTPout);
app.use('/scanftpIN',scanFTPin);
app.use('/scanInput',scanInput);
app.use('/stop',stopThread);
 //Modulo de GPG
app.use('/gpg',convertgpg);
app.use('/scangpg',scangpg);
/****************/
var server = app.listen(process.env.PORT || path.port.toString(), function(){
    console.log('Server listening on port %s', server.address().port);
    console.log('Press Ctrl+C to quit');
});