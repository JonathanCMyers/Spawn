/*  	Author: Jonathan Myers
	Date Created: 6/1/2016
	Date Last Modified: 6/6/2016
	Version: 0.0.0
*/

var mongojs = require("mongojs");
var db = mongojs('localhost:27017/spawn',['account','progress']);
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log("Server started.");

var SOCKET_LIST = {};
var WIDTH = 800;
var HEIGHT = 466;

var initPack = {player:[], bullet:[]};
var removePack = {player:[], bullet:[]};

/***************/
/*   Imports   */
/***************/
var fs = require('fs');
var vm = require('vm');
//vm.runInThisContext(fs.readFileSync(__dirname + '/client/js/entity.js'));
//vm.runInThisContext(fs.readFileSync(__dirname + '/client/js/player.js'));
eval(fs.readFileSync(__dirname + '/client/js/login.js') + '');
eval(fs.readFileSync(__dirname + '/client/js/entity.js') + '');
eval(fs.readFileSync(__dirname + '/client/js/player.js') + '');
eval(fs.readFileSync(__dirname + '/client/js/fireball.js') + '');
eval(fs.readFileSync(__dirname + '/client/js/ability.js') + '');
eval(fs.readFileSync(__dirname + '/client/js/bullet.js') + '');
eval(fs.readFileSync(__dirname + '/client/js/shield.js') + '');
eval(fs.readFileSync(__dirname + '/client/js/bolt.js') + '');
eval(fs.readFileSync(__dirname + '/client/js/freeze.js') + '');
eval(fs.readFileSync(__dirname + '/client/js/knife.js') + '');
/********************/
/*  End of Imports  */
/********************/

// Socket.io

var io = require('socket.io')(serv,{});

// this function will be called whenever there's a connection
io.sockets.on('connection', function(socket) {
	
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;

	socket.on('signIn',function(data) {
		isValidPassword(data,function(res) {
			if(res) {
				Player.onConnect(socket, data.username);
				socket.emit('signInResponse',{success:true});
			} else {
				socket.emit('signInResponse',{success:false});
			}
		});
	});

	socket.on('signUp',function(data) {
		var emittedResponse = false;
		isUsernameTaken(data, function(res) {
			if(res) {
				socket.emit('signUpResponse',{success:false});
				emittedResponse = true;
			}
		});
		
		if(data.password.length < 8 && !emittedResponse) {
			socket.emit('signUpResponse',{success:false});
			emittedResponse = true;
		}
		if(data.username.length < 3 && !emittedResponse) {
			socket.emit('signUpResponse',{success:false});
			emittedResponse = true;
		}
		if(!emittedResponse) {
			addUser(data, function() {
				socket.emit('signUpResponse',{success:true});
			});
		}

	});
	
	socket.on('disconnect',function() {
		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);
	});

	socket.on('sendMsgToServer',function(msg) {
		var playerName = Player.list[socket.id].number;
		for(var i in SOCKET_LIST) {
			SOCKET_LIST[i].emit('addToChat',playerName + ': ' + msg);
		}
	});
	
	socket.on('playerClosePage',function(selfId) {
		delete Player.list[selfId];
		removePack.player.push(selfId);
		console.log('removed');
	});
	
});	

setInterval(function() {
	var pack = {
		player:Player.update(),
		bullet:Bullet.update(),
		fireball:Fireball.update(),
		bolt:Bolt.update(),
		freeze:Freeze.update(),
		knife:Knife.update(),
	}

	for(var i in SOCKET_LIST) {
		var socket = SOCKET_LIST[i];
		socket.emit('init',initPack);
		socket.emit('update',pack);
		socket.emit('remove',removePack);
	}
	//printTotalObjects();
	initPack.player = [];
	initPack.bullet = [];
	initPack.fireball = [];
	initPack.bolt = [];
	initPack.freeze = [];
	initPack.knife = [];
	removePack.player = [];
	removePack.bullet = [];
	removePack.fireball = [];
	removePack.bolt = [];
	removePack.freeze = [];
	removePack.knife = [];
},1000/25);

printTotalObjects = function() {
	var playerLength = 0;
	var bulletLength = 0;
	var fireballLength = 0;
	var boltLength = 0;
	var freezeLength = 0;
	var knifeLength = 0;
	for(var i in Player.list) {
		playerLength++;
	}
	for(var i in Bullet.list) {
		bulletLength++;
	}
	for(var i in Fireball.list) {
		fireballLength++;
	}
	for(var i in Bolt.list) {
		boltLength++;
	}
	for(var i in Freeze.list) {
		freezeLength++;
	}
	for(var i in Knife.list) {
		knifeLength++;
	}
	console.log("Player: " + playerLength);
	console.log("Bullet: " + bulletLength);
	console.log("Fireball: " + fireballLength);
	console.log("Bolt: " + boltLength);
	console.log("Freeze: " + freezeLength);
	console.log("Knife: " + knifeLength);
}
