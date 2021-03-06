'use strict';


(function(global){
    var application={};
    global.$application = application;
     
    application.appRenderer = new AppRenderer();
    application.messenger = new Messenger();
    application.user = 'dummy user';
    application.loginHandlerer = new RegistrationHandler();
    application.messenger.loadMessages();
    application.inFocus = true;
    //application.messenger.getUsersData();
    
    //todo == process login
    // load not all comments...
    //console.log()
    
    document.addEventListener('userLogin', function(event){
        application.user = event.detail;
        application.loginHandlerer.userForm.userLoginSucess(event.detail);
        application.appRenderer.enableComments();
        application.messenger.socket.emit('user login', {user:event.detail});
        application.appRenderer.markOwnedMessages(application.user);
    });
    
    global.onfocus = function(){
        application.inFocus = true;
        global.cancelFlashTitle();
    }
    global.onblur = function(){
        application.inFocus = false;
    }

})(window);

