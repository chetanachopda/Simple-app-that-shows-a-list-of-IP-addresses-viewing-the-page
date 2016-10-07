var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server)

var users = [];
var connections = [];


app.get('/',function(request, resolve){
	resolve.sendFile(__dirname + '/index.html');
})

//app.use('/client',express.static(__dirname + '/client'));


server.listen(2000);

io.sockets.on('connection', function(socket){
	connections.push(socket.handshake.address);	
	console.log("socket connected"+connections.length);
	console.log(connections)
	setInterval(function(){
		socket.emit('users',  {date: connections});
	},1000)

	//Disconnect
	socket.on('disconnect', function(){
		connections.splice(connections.indexOf(socket),1);
		console.log('Disconnected'+connections.length);	
	})
	

})
