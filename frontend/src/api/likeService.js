import {
    BASE_URL, LIKE_URL
} from './constants';
import { getJWT } from '../utils/authHelper';


/*LIKE */
export async function Like(postId) {
    var jwt = await getJWT();

    var options = {
        method: 'post',
        headers: {
            'x-access-token': jwt,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await fetch(BASE_URL + LIKE_URL + 'like/' + postId, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}

/*UNLIKE*/
export async function Unlike(postId) {
    var jwt = await getJWT();

    var options = {
        method: 'delete',
        headers: {
            'x-access-token': jwt,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await fetch(BASE_URL + LIKE_URL + 'unlike/' + postId, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}


/*GET LIKES*/
export async function GetLikes(postId) {
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
        const response = await fetch(BASE_URL + LIKE_URL + postId, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}









