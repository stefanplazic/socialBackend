import {
    BASE_URL, USERS_URL, SIGN_URL, REGISTER_URL,
} from './constants';

import { getJWT } from '../utils/authHelper';

export async function signIn(username, password) {
    const response = await fetch(BASE_URL + USERS_URL + SIGN_URL, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'username': username,
            'password': password
        })
    }
    )
    const data = await response.json();
    return data

}

//register user
export async function register(username, email, password) {
    const response = await fetch(BASE_URL + USERS_URL + REGISTER_URL, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'username': username,
            'password': password,
            'email': email
        })
    }
    )
    const data = await response.json();
    return data

}

//follow user
export async function follow(userId) {
    var jwt = await getJWT();


    var options = {
        method: 'put',
        headers: {
            'x-access-token': jwt,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await fetch(BASE_URL + USERS_URL + 'follow/' + userId, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}

export async function unFollow(userId) {
    var jwt = await getJWT();


    var options = {
        method: 'put',
        headers: {
            'x-access-token': jwt,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await fetch(BASE_URL + USERS_URL + 'unfollow/' + userId, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}




//get user data
export async function userData(userId) {
    var jwt = await getJWT();


    var options = {
        method: 'get',
        headers: {
            'x-access-token': jwt,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await fetch(BASE_URL + USERS_URL + 'profileData/' + userId, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}

export async function updateAvatar(avatarUri) {
    var jwt = await getJWT();

    //append avatar uri to form data
    let form = new FormData();
    form.append('avatar', avatarUri);

    var options = {
        method: 'put',
        headers: {
            'x-access-token': jwt,
            'Accept': 'application/json'
        },
        body: form
    };
    try {
        const response = await fetch(BASE_URL + USERS_URL + 'avatarUpdate', options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}

//request new password


export async function forgotPassword(email) {

    var options = {
        method: 'put',
        headers: {

            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({

            'email': email
        })
    };
    try {
        const response = await fetch(BASE_URL + USERS_URL + 'forgotPassword/', options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}
//isVerifed

export async function isVerifed() {
    var jwt = await getJWT();

    //append avatar uri to form data


    var options = {
        method: 'get',
        headers: {
            'x-access-token': jwt,
            'Accept': 'application/json'
        }
    };
    try {
        const response = await fetch(BASE_URL + USERS_URL + 'isVerifed', options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}

//check email avabiality
export async function checkEmail(email) {

    var options = {
        method: 'get',
        headers: {

            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await fetch(BASE_URL + USERS_URL + 'checkemail/' + email, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}


//check username avabiality
export async function checkUsername(username) {

    var options = {
        method: 'get',
        headers: {

            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await fetch(BASE_URL + USERS_URL + 'checkname/' + username, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}