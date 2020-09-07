import HttpMethod from "../constants/HttpMethod";
import {request} from "../base/Http";

const URL = {
  getFriends: "/friends",
  getSentRequests: "/friends/request/sent",
  getPendingRequests: "/friends/request/pending",
  acceptRequest: "/friends/request/",
  declineRequst: "/friends/request/",
  deleteFriend: "/friends/",
  searchUsers: "/friends/search",
  addFriend: "/friends/"
}

export async function getFriends() {
  return await request(URL.getFriends, {}, HttpMethod.GET);
}

export async function getSentRequests() {
  return await request(URL.getSentRequests, {}, HttpMethod.GET);
}

export async function getPendingRequests() {
  return await request(URL.getPendingRequests, {}, HttpMethod.GET);
}

export async function acceptRequest(friendId) {
  return await request(URL.acceptRequest + friendId + "/accept", {}, HttpMethod.PUT);
}

export async function declineRequst(friendId) {
  return await request(URL.declineRequst + friendId + "/decline", {}, HttpMethod.PUT);
}

export async function deleteFriend(friendId) {
  return await request(URL.deleteFriend + friendId, {}, HttpMethod.DELETE);
}

export async function addFriend(friendId) {
  return await request(URL.addFriend + friendId, {}, HttpMethod.POST);
}

export async function searchUsers(searchParam) {
  return await request(URL.searchUsers, {searchParam}, HttpMethod.GET);
}
