var express = require('express');
var app = express();

var http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    morgan = require('morgan');



var hostname =  process.env.OPENSHIFT_NODEJS_IP || process.env.IP;
var port =  process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT;



app.use(morgan('dev'));
app.use(express.static(path.normalize(__dirname + '/../frontend')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.sockets.on('connection', function(socket){
 
  socket.on('chat message', function(msg){
    console.log(msg);
    io.emit('chat message', msg);
  });
});


/*var server = http.createServer(function(req, res){
  console.log(req.headers);
    res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<html><body><h1>Sooon chat will be here!</h1></body></html>');
});
*/
http.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});