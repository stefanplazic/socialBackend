import {
    BASE_URL, SEARCH_URL
} from './constants';
import { getJWT } from '../utils/authHelper';


/*LIKE */
export async function searchUsers(username) {
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
        const response = await fetch(BASE_URL + SEARCH_URL + 'users/' + username, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }



}

export async function searchTags(tag) {
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
        const response = await fetch(BASE_URL + SEARCH_URL + 'tag/' + tag, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}

export async function postsByTag(tag, pageNum) {
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
        const response = await fetch(BASE_URL + SEARCH_URL + 'posts/' + tag + '/' + pageNum, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}












