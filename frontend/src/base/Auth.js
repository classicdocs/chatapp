
export function getUserFromLocalStorage() {
  let user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function setUserToLocalStorage(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function setTokenToLocalStorage(token) {
  localStorage.setItem("token", token);
}

export function isUserLoggedIn() {
  return getUserFromLocalStorage() != null && getToken();
}

export function clearUserData() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}