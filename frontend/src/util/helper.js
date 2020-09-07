import {getUserFromLocalStorage} from "../base/Auth";

export function isIdFromUser(id) {

  let userId = getUserFromLocalStorage()._id;

  return userId === id;
}