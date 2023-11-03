function login(id, pw) {
    if(id !== 'admin'){
        return 404
    }
    else{
        if(pw !== 'testadmin'){
            return 401
        }
        else{
            return 200
        }
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
