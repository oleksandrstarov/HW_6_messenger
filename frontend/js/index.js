'use strict';


var socket = new io(); //from https://cdn.socket.io/socket.io-1.2.0.js


var messageForm = document.querySelector('.chat-message-form');
var messageField = document.querySelector('.message-value');

messageForm.addEventListener('submit', addMessage);




socket.on('chat message', function(msg){
    console.log('test');
    var messagesList = document.querySelector('#messages');
    messagesList.innerHTML += '<li>' + msg + '</li>';
    console.log('test');
    var element = document.querySelector('.all-comments');
    element.scrollTop = element.scrollHeight;
    console.log('test');
});



function addMessage(event){
    event.preventDefault();
     console.log(messageField);
    if(messageField.value !== ''){
        console.log(messageField.value);
       
        socket.emit('chat message', messageField.value);
        messageField.value = '';
    }
    return false;
}
