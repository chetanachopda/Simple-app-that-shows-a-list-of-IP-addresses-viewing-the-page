var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server)

var users = {};

var port = process.env.PORT || 2000;

app.get('/',function(request, resolve){
	resolve.sendFile(__dirname + '/index.html');
})

console.log("listening at "+port)
server.listen(port);

//socket new client connection 
io.sockets.on('connection', function(socket){   
	// add key value pair for ip with no_of_browser_tabs_open
    if(!users[socket.handshake.headers['x-forwarded-for']]) 
		users[socket.handshake.headers['x-forwarded-for']] = 1
	else
		users[socket.handshake.headers['x-forwarded-for']] += 1;
	console.log(users)
	setInterval(function(){
		socket.emit('users',  {users: users});
	},1000);

	//Disconnect	
	socket.on('disconnect', function(){
		//remove one browser_tab_count from client ip 
		users[socket.handshake.headers['x-forwarded-for']] -=1;
		//no tabs are exist then remove client entry
		if(users[socket.handshake.headers['x-forwarded-for']]  == 0)
			delete users[socket.handshake.headers['x-forwarded-for']];
		console.log(users)

	})
	

})
