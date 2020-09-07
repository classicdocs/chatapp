import HttpMethod from "../constants/HttpMethod";
import {request} from "../base/Http";

const URL = {
  getInbox: "/inbox",
  getMessages: "/inbox/",
  sendMessage: "/inbox/message"
}

export async function getInbox() {
  return await request(URL.getInbox, {}, HttpMethod.GET);
}

export async function getMessages(friendId) {
  return await request(URL.getMessages + friendId, {}, HttpMethod.GET);
}

export async function sendMessage(friendId, message) {
  return await request(URL.sendMessage, {friendId, message}, HttpMethod.POST);
}