'use strict';

function RegistrationHandler (){
    this.userForm = new SignInView();
    this.userForm.submitEl.addEventListener('click', this.onSubmitForm.bind(this));
}


RegistrationHandler.prototype.onSubmitForm = function(event){
    var userForm = this.userForm;
    var formData = this.getFormData();
    if(!formData){
        alert("Please use letters and digits only");
        return;
    }
    if(formData === 'empty'){
        return;
    }
    
    if(userForm.currentMode === 'signIn'){
        formData.eventType = 'signIn';
    }
    
    if(userForm.currentMode === 'register'){
        formData.eventType = 'register';
    }
    
    this.sendLoginRequest(formData);
};

RegistrationHandler.prototype.getFormData = function(){
    var userName = this.userForm.userNameEl.value;
    var password = this.userForm.passwordEl.value;
    
    if(userName === '' || password === ''){
        return 'empty';
    }
    
    return {
        userName : userName,
        password : password
    };
    
    return;
};

RegistrationHandler.prototype.processSubmitRespond = function(responseData){
    responseData = JSON.parse(responseData);
    
    if(responseData.response === 'success'){
        var userName = responseData.userName;
        document.dispatchEvent(new CustomEvent('userLogin', {detail: userName}));
    }else{
        if(responseData.event === 'login'){
            alert("Incorrect details for login");
        }else{
            alert("User already exists");
        }
        
    }
};

RegistrationHandler.prototype.sendLoginRequest = function(data){
    console.log(data);
    $ajaxUtils.sendPostRequest('/login', this.processSubmitRespond, JSON.stringify(data));
};