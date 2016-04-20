'use strict';

function AppRenderer(){
    this.messageTemplate = document.querySelector('#message-template').innerHTML;
    this.messageForm = document.querySelector('.chat-message-form');
    this.messageField = document.querySelector('.message-value');
    this.messagesList = document.querySelector('#messages');
    this.messagesFrame = document.querySelector('.all-comments');
}

AppRenderer.prototype.showMessage = function(messageObject){
    var html = this.messageTemplate;
    html = this.insertProperty(html, 'userName', messageObject.user);
    html = this.insertProperty(html, 'messageContent', messageObject.message);
    html = this.insertProperty(html, 'timeStamp', this.createTimeStamp(messageObject.date));
    this.messagesList.innerHTML += html;
    this.messagesFrame.scrollTop = this.messagesFrame.scrollHeight;
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
    console.log(date.getHours().length);
    var hours = 10 > date.getHours() > 0 ? '0'+date.getHours() : date.getHours();
    var minutes = 10 > date.getMinutes() > 0  ? '0'+date.getMinutes() : date.getMinutes();
    var seconds = 10 > date.getSeconds() > 0  ? '0'+date.getSeconds() : date.getSeconds();
    
    return (hours) + ':'+ (minutes)+ ':'+ (seconds);
};

AppRenderer.prototype.enableComments = function(){
    $application.appRenderer.messageForm.removeAttribute('hidden');
};


