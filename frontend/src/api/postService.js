import {
    BASE_URL, POST_URL
} from './constants';
import { getJWT } from '../utils/authHelper';


/*FUNCTION FOR CREATEING POST */
export async function createPosts(post) {
    var jwt = await getJWT();

    var options = {
        method: 'post',
        headers: {
            'x-access-token': jwt,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'post': post })
    };
    try {
        const response = await fetch(BASE_URL + POST_URL + 'create', options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}

/*FUNCTION LOAD LATEST POSTS */
export async function latestPosts(pageNumber) {
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
        const response = await fetch(BASE_URL + POST_URL + 'latest/' + pageNumber, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}

/*NEWEST POST */
export async function newestPosts(pageNumber) {
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
        const response = await fetch(BASE_URL + POST_URL + 'following/' + pageNumber, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}


/*FUNCTION FOR  POST DELETE */
export async function deletePost(postId) {
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
        const response = await fetch(BASE_URL + POST_URL + 'remove/' + postId, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}








