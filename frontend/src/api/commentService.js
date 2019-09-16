import {
    BASE_URL, GRAPHQL_URL,COMMENT_URL
} from './constants';
import { getJWT } from '../utils/authHelper';


/*FUNCTION FOR CREATEING POST */
export async function createComment(comment) {
    var jwt = await getJWT();


    var options = {
        method: 'post',
        headers: {
            'x-access-token': jwt,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'comment':comment})
    };
    try {
        const response = await fetch(BASE_URL + COMMENT_URL+'create', options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}


/*FUNCTION FOR  POST UPADATE */
export async function commentsByPost(postId) {
    var jwt = await getJWT();

    
    var options = {
        method: 'get',
        headers: {
            'x-access-token': jwt,
            'Accept': 'application/json'
        }
    };
    try {
        const response = await fetch(BASE_URL + COMMENT_URL+'bypost/'+postId, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}


/*FUNCTION FOR  COMMENT DELETE */
export async function updatePost(commentId) {
    var jwt = await getJWT();

    const requestBody = {
        query: `
        mutation DeleteComment($commentId: ID!) {
            deleteComment(commentId:$commentId) 
          }
          
          `,
        variables: {
            commentId: commentId
        }
    };
    var options = {
        method: 'post',
        headers: {
            'x-access-token': jwt,
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
    };
    try {
        const response = await fetch(BASE_URL + GRAPHQL_URL, options);
        const data = await response.json();
        return data
    }
    catch (err) { console.error(err); }

}




