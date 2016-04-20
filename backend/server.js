var express = require('express');
var app = express();

var http = require('http').Server(app),
    io = require('socket.io')(http),
    bodyParser = require('body-parser'),
    path = require('path'),
    morgan = require('morgan'),
    mongodb = require('./mongo.js');



var hostname =  process.env.OPENSHIFT_NODEJS_IP || process.env.IP;
var port =  process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT;

app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(express.static(path.normalize(__dirname + '/../frontend')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/login', function(req, res){
    handleLogin(req.body, function(result){
        res.send(result);
    });
});

app.get('/getMessages', function(req, res){
    findMessages(function(result){
        res.send(result);
    });
});

app.get('/getUsers', function(req, res){
    res.send(null);
});


io.sockets.on('connection', function(socket){

  io.emit('user connected', {user:'guest'});
  
  socket.on('chat message', function(messageObject){
   
    mongodb.saveMessage(messageObject, function(data){
      //process data
    });
    io.emit('chat message', messageObject);
  });
  
  socket.on('disconnect', function(){
    console.log(socket.id);
    io.emit('user disconected', {user:'some'});
  });
  
  socket.on('user login', function(userData){
    io.emit('user login', userData);
  });
});



http.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});


function handleLogin(userData, callback){
  if(userData.eventType === 'signIn'){
        mongodb.checkLogin(userData, function(response){
            callback(JSON.stringify(response));
        });
    }else{
        mongodb.registerUser(userData, function(response){
            callback(JSON.stringify(response));
        });
    }
}

function findMessages(callback){
    mongodb.findMessages(null, function(docs){
        callback(JSON.stringify(docs));
    });
}
