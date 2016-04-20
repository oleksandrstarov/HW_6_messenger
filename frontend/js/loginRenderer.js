'use strict';

function SignInView(){
    this.element = document.querySelector('.login-component');
    this.listSignEl = document.querySelector('#list-sign');
    this.listRegisterEl = document.querySelector('#list-register');
    this.header =  document.querySelector('#sign-header');
    this.userNameEl = document.querySelector('#inputUsername');
    this.passwordEl = document.querySelector('#inputPassword');
    this.submitEl = document.querySelector('#submit');
    this.currentMode = 'signIn';
    this.listSignEl.addEventListener('click', this.tabClickHandler.bind(this));
    this.listRegisterEl.addEventListener('click', this.tabClickHandler.bind(this));
}

SignInView.prototype.tabClickHandler = function(event){
    var focusTab = event.target.parentNode;
    if(!focusTab.classList.contains('active')){
        var secondTab = null;
        
        if(focusTab === this.listSignEl){
            secondTab = this.listRegisterEl;
            this.header.textContent = 'Please sign in';
            this.submitEl.textContent = 'Sign in';
            this.currentMode = 'signIn';
        }else{
            secondTab = this.listSignEl;
            this.header.textContent = 'Please register';
            this.submitEl.textContent = 'Register';
            this.currentMode = 'register';
        }
        focusTab.classList.add('active');
        secondTab.classList.remove('active');
    }
    
};


SignInView.prototype.userLoginSucess = function(userName){
    this.element.innerHTML = '<h2>Hello, ' + userName + '!</h2>';
};