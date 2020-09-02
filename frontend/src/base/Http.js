import CONFIG from "../config";
import HttpMethod from "../constants/HttpMethod";
import {getToken} from "../base/Auth";
import axios from "axios";

const Axios = (function () {
  let instance;

  function createInstance() {
    return axios.create({
      baseURL: CONFIG.baseURL
    });
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }

      instance.defaults.headers.common["x-access-token"] = getToken();
      instance.all = axios.all;

      return instance;
    }
  };
})();

Axios.getInstance().interceptors.response.use(
  response => {
    response.ok = response.status >= 200 && response.status < 300;

    return response;
  },
  async error => {
    const {
      response: { status }
    } = error;
    return error;
  }
);

export async function request(
  url,
  data = [],
  method = HttpMethod.GET,
  options = {}
) {
  return await connect(
    url,
    data,
    method,
    options
  );
}

export async function connect(url, data, method, options) {
  switch (method) {
    case HttpMethod.GET: {
      return await Axios.getInstance().get(
        url + makeParametersList(data),
        options
      );
    }
    case HttpMethod.POST:
      return Axios.getInstance().post(url, data, options);
    case HttpMethod.PUT:
      return Axios.getInstance().put(url, data, options);
    case HttpMethod.DELETE:
      return Axios.getInstance().delete(url, options);
  }
}

export function makeParametersList(parameters) {
  let parametersList = `?`;

  Object.keys(parameters).map(
    (key, index) => (parametersList += `${key}=${parameters[key]}&`)
  );

  parametersList = parametersList.slice(0, -1);

  return parametersList === "?" ? "" : parametersList;
}