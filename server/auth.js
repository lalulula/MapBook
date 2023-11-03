function login(id, pw) {
    if(id === 'admin' && pw === 'testadmin' ){
        return true
    }
    else{
        return false
    }
}

function register(id, pw) {
    if(id === 'admin' && pw === 'testadmin' ){
        return true
    }
    else{
        return false
    }
}

export {login, register};
