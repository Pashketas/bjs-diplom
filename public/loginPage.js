'use strict'

const userForm = new UserForm();
userForm.loginFormCallback = (data) => {
    const callback = (response) => { 
        if (response.success) {
            location.reload();
        } else {
            userForm.setLoginErrorMessage(response.error);
        }
    };

    ApiConnector.login({login: data.login, password: data.password}, callback);
}

userForm.registerFormCallback = (data) => {
    const callback = (response) => {
        if (response.success) {
            location.reload();
        } else {
            userForm.setRegisterErrorMessage(response.error);
        }
    };
    
    ApiConnector.register({login: data.login, password: data.password}, callback);
}
