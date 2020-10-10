
var express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res)
{
    res.sendfile(__dirname + '/public/index.html');
});


var clients = {};

io.sockets.on('connection', function(socket)
{
    socket.on('sendchat', function(data)
    {
        io.sockets.emit('updatechat', socket.username, data);
    });
	
	
	console.log('user Image Before');
	
	
	 socket.on('base64 file', function(msg)
    {
        console.log('received base64 file from' + msg.username);
        socket.username = msg.username;

        io.sockets.emit('base64 file',

            {
                username: socket.username,
                file: msg.file,
                fileName: msg.fileName
            }

        );
    });

	
	console.log('user Image After');

    socket.on('adduser', function(username)
    {
        socket.username = username;
        clients[username] = username;
        socket.emit('updatechat', 'Server ', ' You have connected  --- ' + '<b>' + username + '<b/>' );
        socket.broadcast.emit('updatechat', 'Server'
		, username + ' has connected');
        io.sockets.emit('updateusers', clients);
    });



   

    socket.on('disconnect', function() {
        delete clients[socket.username];
        io.sockets.emit('updateusers', clients);
        socket.broadcast.emit('updatechat', 'Server'
		, socket.username + ' has disconnected');
    });
});


var port = 8080;
server.listen(port);
console.log('Listening on port: ' + port);