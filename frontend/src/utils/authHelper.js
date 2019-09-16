export async function isUserLogged() {
  try {
    const value = await localStorage.getItem('userData');
    if (value !== null)
      return true
    else
      return false;

  } catch (err) {
    console.error(err);
  }

}

export async function login(userToken, userData) {
  try {
    if (userToken !== '') {
      //make one object to save at once
      userData.token = userToken;
      await localStorage.setItem('userData', JSON.stringify(userData));


    }

  } catch (err) {
    console.error(err);
  }

}

export async function logoutFunc() {
  try {

    await localStorage.removeItem('userData');

  } catch (err) {
    console.error(err);
  }

}
export async function getJWT() {
  try {

    var token = JSON.parse(await localStorage.getItem('userData'));
    token = token ? token : '';
    return token.token;

  } catch (err) {
    console.error(err);
  }

}

export async function getUserId() {
  try {

    var userId = JSON.parse(await localStorage.getItem('userData'));
    userId = userId ? userId : '';
    return userId._id;

  } catch (err) {
    console.error(err);
  }

}

