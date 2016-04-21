'use strict';

function AppRenderer(){
    this.messageTemplate = document.querySelector('#message-template').innerHTML;
    this.messageForm = document.querySelector('.chat-message-form');
    
    this.messageField = document.querySelector('.message-value');
    this.messagesList = document.querySelector('#messages');
    
    this.messagesFrame = document.querySelector('.all-comments');
    this.loadAnimation = document.querySelector('#load-animation').innerHTML;
    this.notificationText = document.querySelector('.notification-text');
    
    this.liveUsersHeader = document.querySelector('#live-count');
    this.liveUsersPanel = document.querySelector('#connected-users');
    this.liveUserTemplate = document.querySelector('#live-user-template').innerHTML;
    
    this.notificationHandler();
    this.prevUser ='';

}

AppRenderer.prototype.showMessage = function(messageObject){
    if(messageObject.user === this.prevUser){
        var messages = document.querySelectorAll('.message-content');
        var message = messages[messages.length-1];
        message.innerHTML += '<br/>' + messageObject.message;
    }else{
         var html = this.messageTemplate;
        html = this.insertProperty(html, 'userName', messageObject.user);
        if(messageObject.user === $application.user){
            html = this.insertProperty(html, 'currentUser', 'current-user');
        }else{
            html = this.insertProperty(html, 'currentUser', '');
        }
        html = this.insertProperty(html, 'owner', messageObject.user);
        html = this.insertProperty(html, 'messageContent', messageObject.message);
        html = this.insertProperty(html, 'timeStamp', this.createTimeStamp(messageObject.date));
        this.messagesList.innerHTML += html;
    }
    this.messagesFrame.scrollTop = this.messagesFrame.scrollHeight;
    this.prevUser = messageObject.user;
};

AppRenderer.prototype.insertProperty = function(string, propName, propValue){
    var propToReplace = '{{' + propName + '}}';
    string = string.replace(new RegExp(propToReplace, 'g'), propValue);
    return string;
};

AppRenderer.prototype.readMessageValue = function(){
    var value = this.messageField.value;
    this.messageField.value = '';
    return value;
};

AppRenderer.prototype.createTimeStamp = function(dateString){
    if(!dateString){
        var date = new Date();
    }else{
        var date = new Date(dateString);
    }

    var hours = 10 > date.getHours() > 0 ? '0'+date.getHours() : date.getHours();
    var minutes = 10 > date.getMinutes() > 0  ? '0'+date.getMinutes() : date.getMinutes();
    var seconds = 10 > date.getSeconds() > 0  ? '0'+date.getSeconds() : date.getSeconds();
    
    return (hours) + ':'+ (minutes)+ ':'+ (seconds);
};

AppRenderer.prototype.enableComments = function(){
    $application.appRenderer.messageForm.removeAttribute('hidden');
};

AppRenderer.prototype.showLoading = function(){
   this.messagesFrame.innerHTML = this.loadAnimation;
    
};
AppRenderer.prototype.hideLoading = function(){
   this.messagesFrame.innerHTML = '';
   this.messagesFrame.appendChild(this.messagesList);
    
};

AppRenderer.prototype.enableComments = function(){
    $application.appRenderer.messageForm.removeAttribute('hidden');
};

AppRenderer.prototype.updateLiveUsers = function(usersArray){
    var count = usersArray.length;
    var guestsCount = 0;
    var usersListHTML = '';
    for(var i=0; i< count; i++){
        if(usersArray[i] === 'Guest'){
            guestsCount++;
            continue;
        }
        var html = this.liveUserTemplate;
        html = this.insertProperty(html, 'userName', usersArray[i]);
        html = this.insertProperty(html, 'liveUser', 'live-user');
        usersListHTML += html;
    }
    for(var i=0; i< guestsCount; i++){
        var html = this.liveUserTemplate;
        html = this.insertProperty(html, 'userName', 'Guest');
        html = this.insertProperty(html, 'liveUser', 'live-guest');
        usersListHTML += html;
    }
    
    this.liveUsersHeader.innerHTML = ' ' + count;
    this.liveUsersPanel.innerHTML = usersListHTML;
};

AppRenderer.prototype.markOwnedMessages = function(user){
    var messages = document.querySelectorAll('p[owner='+user+']');
    for(var i=0; i< messages.length; i++){
        messages[i].classList.add('current-user');

    }
};

AppRenderer.prototype.notificationHandler = function () {
    
    var original = 'Socket.IO chat';
    var timeout;
    
    window.flashTitle = function (newMsg, howManyTimes) {
        console.log('notification');
        function step() {
            document.title = (document.title == original) ? newMsg : original;
    
            if (--howManyTimes > 0) {
                timeout = setTimeout(step, 750);
            };
        };
    
        howManyTimes = parseInt(howManyTimes);
    
        if (isNaN(howManyTimes)) {
            howManyTimes = 5;
        };
    
        cancelFlashTitle(timeout);
        step();
    };
    
    window.cancelFlashTitle = function () {
        clearTimeout(timeout);
        document.title = original;
    };

};

AppRenderer.prototype.notifyTyping = function (user) {
    this.notificationText.innerHTML = user + ' is typing...';
    console.log('type');
    
    setTimeout(function(){
        console.log(this.notificationText);
        this.notificationText.innerHTML = '';
    }.bind(this), 1000);
};
