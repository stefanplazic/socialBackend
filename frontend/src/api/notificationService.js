import {
    BASE_URL, NOTIFICATIONS_URL
} from './constants';
import { getJWT } from '../utils/authHelper';


/*LIKE */
export async function NotificationList() {
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
        const response = await fetch(BASE_URL + NOTIFICATIONS_URL + 'list/', options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}

/*UNLIKE*/
export async function Mark(notId) {
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
        const response = await fetch(BASE_URL + NOTIFICATIONS_URL + 'mark/' + notId, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}











