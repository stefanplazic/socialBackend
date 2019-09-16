import {
  BASE_URL, MEDIA_URL, MEDIA_UPLOAD
} from './constants';
import { getJWT } from '../utils/authHelper';

export async function uploadVideo(mediaUri) {
  var jwt = await getJWT();
  //append avatar uri to form data
  let form = new FormData();
  form.append('video', mediaUri);

  var options = {
    method: 'post',
    headers: {
      'x-access-token': jwt,
      'Accept': 'application/json'
    },
    body: form
  };
  try {
    const response = await fetch(BASE_URL + MEDIA_URL + MEDIA_UPLOAD, options);
    const data = await response.json();
    return data
  }
  catch (err) { console.error(err); }

}





