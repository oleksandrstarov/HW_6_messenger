'use strict';

function Messenger(){
    this.socket = new io(); //from https://cdn.socket.io/socket.io-1.4.5.js
    //console.log(this.socket);
    this.socket.on('chat message', this.handleChatMessage);
    this.socket.on('user connected', this.handleNewUser);
    this.socket.on('user login', this.handleNewUser);
    $application.appRenderer.messageForm.addEventListener('submit', this.emitMessage.bind(this));
    
}

Messenger.prototype.handleChatMessage = function(messageObject){
    $application.appRenderer.showMessage(messageObject);
};

Messenger.prototype.emitMessage = function(event){
    event.preventDefault();
    var message = $application.appRenderer.readMessageValue();
    if(message){
        this.socket.emit('chat message', {user: $application.user, message: message});
    }
};

Messenger.prototype.loadMessages = function(){
    $ajaxUtils.sendGetRequest('/getMessages', this.processMessages);
};

Messenger.prototype.processMessages = function(data){
    data = JSON.parse(data);
    var messagesArray = data[0].messages;
    //load 20 prev messages only
    //var limit = messagesArray.length > 20 ? 20 : messagesArray.length;
    var limit = messagesArray.length;
    var i = 0;
    while(i<limit){
        $application.appRenderer.showMessage(messagesArray[messagesArray.length-limit +i]);
        i++;
    }
};

Messenger.prototype.getUsersData = function(){
    $ajaxUtils.sendGetRequest('/getUsers', this.processUsersData);
};

Messenger.prototype.processUsersData = function(data){
    data = JSON.parse(data);
    console.log(data);
};

Messenger.prototype.handleNewUser = function(data){
    console.log('connected ' + data.user);
};