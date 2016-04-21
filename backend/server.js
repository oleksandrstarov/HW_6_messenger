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
       setTimeout(function() {
         res.send(result);
       }, 1200);
        
    });
});

app.get('/getUsers', function(req, res){
    res.send(null);
});


var connectedClients =[];

io.sockets.on('connection', function(socket){
  if(!socket.userName){
    socket.userName = 'Guest';
  }
  connectedClients = Object.keys(io.sockets.connected).map(function (key) {return io.sockets.connected[key]})
  console.log(connectedClients[0].userName);
  console.log(Object.keys(io.sockets.connected).length);
  
  
  io.emit('live users', {liveUsers: getLiveUsersArray(connectedClients)});
  
  socket.on('chat message', function(messageObject){
   
    mongodb.saveMessage(messageObject, function(data){
      //process data
    });
    io.emit('chat message', messageObject);
  });
  
  socket.on('disconnect', function(){
    var index = connectedClients.indexOf(socket);     
    if(index > -1){
      connectedClients.splice(index, 1);
    }
    io.emit('live users', {liveUsers: getLiveUsersArray(connectedClients)});
  });
  
   socket.on('typing', function(userData){
    io.emit('typing', userData);
  });
  
  socket.on('user login', function(userData){
    
    socket.userName = userData.user;
    
    io.emit('live users', {liveUsers: getLiveUsersArray(connectedClients)});
  });
});

function getLiveUsersArray(connectedClients){
  var array = [];
  for(var i=0; i<connectedClients.length; i++){
    array.push(connectedClients[i].userName);
  }
  return array;
}




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
