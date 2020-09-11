import {clearUserData, setTokenToLocalStorage, setUserToLocalStorage} from "../base/Auth";
import HttpMethod from "../constants/HttpMethod";
import {request} from "../base/Http";

const URL = {
  login: "/login",
  register: "/register",
  me: "/me",
  uploadProfileImage: "/upload"
}

export async function login(email, password) {
  clearUserData();

  let data = {email, password}

  return await request(URL.login, data, HttpMethod.POST).then(response => {
    if (!response.ok) {
      return response;
    }

    setTokenToLocalStorage(
      response.data.token,
    );

    return request(URL.me).then(response => {
      if (response.data) {
          setUserToLocalStorage(response.data);
        }

      return response;
    });
  });
}

export async function register(data) {
  return await request(URL.register, data, HttpMethod.POST);
}

export async function uploadProfileImage(data) {
  return await request(URL.uploadProfileImage, data, HttpMethod.POST);
}