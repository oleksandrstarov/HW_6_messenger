'use strict';

function Messenger(){
    this.socket = new io(); //from https://cdn.socket.io/socket.io-1.4.5.js
    //console.log(this.socket);
    this.socket.on('chat message', this.handleChatMessage);
    this.socket.on('live users', this.updateLiveList);
    this.socket.on('typing', this.onTyping);
    $application.appRenderer.messageForm.addEventListener('submit', this.emitMessage.bind(this));
    $application.appRenderer.messageField.addEventListener('keypress', this.onUserTyping
                                                    .bind(this));
    window.onunload = function(){
        this.socket.emit('disconnect', {user: $application.user});
    };
}

Messenger.prototype.handleChatMessage = function(messageObject){
    if($application.user !== messageObject.user && !$application.inFocus){
        window.flashTitle(messageObject.user + " sent a Message");
    }
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
    $application.appRenderer.showLoading();
    $ajaxUtils.sendGetRequest('/getMessages', this.processMessages);
};

Messenger.prototype.processMessages = function(data){
    data = JSON.parse(data);
    $application.appRenderer.hideLoading();
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

Messenger.prototype.updateLiveList = function(data){
    
    data = data.liveUsers;
    $application.appRenderer.updateLiveUsers(data);
};

Messenger.prototype.onUserTyping = function(event){
    if (event.which == 13 || event.keyCode == 13) {
        return false;
    }
    
    this.socket.emit('typing', {user: $application.user});
};

Messenger.prototype.onTyping = function(data){
    
    if(data.user !== $application.user){
        $application.appRenderer.notifyTyping(data.user);
    }
    
};