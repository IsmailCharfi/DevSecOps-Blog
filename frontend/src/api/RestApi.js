import { BASE_URL } from "../utilities/Constants";

export class HTTPException extends Error {
  response = {
    data: {}
  };

  constructor(data) {
    super("an error has occured");
    this.response.data = data;
  }
}

export default class RestApi {
    baseUrl;

    constructor(fetcherArgs) {
        this.headers = fetcherArgs?.headers ?? new Headers();
        this.baseUrl = fetcherArgs?.baseUrl ?? "";
    }

    get(url) {
        return this.sendRequest(url, "GET", null);
    }

    post(url, body) {
        return this.sendRequest(url, "POST", body);
    }

    put(url, body) {
        return this.sendRequest(url, "PUT", body);
    }

    delete(url) {
        return this.sendRequest(url, "DELETE");
    }

    async sendRequest(url, method, body = null) {
        if (body && !(body instanceof FormData)) {
            body = JSON.stringify(body);
        }
        let response = null;

        response = await fetch(this.baseUrl + url, {
            method,
            headers: this.getRequestHeaders(body),
            ...(body ? { body } : {}),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new HTTPException(data);
        }

        return await response.json();
    }

    getRequestHeaders(body) {
        const isFormData = body instanceof FormData;
        const requestHeaders = new Headers();

        const token = window.localStorage.getItem("token");

        if (!isFormData) requestHeaders.append("Content-Type", "application/json");

        if (token) {
            requestHeaders.append("Authorization", `Bearer ${token}`);
        }

        requestHeaders.append("Accept", "application/json; plain/text");

        return requestHeaders;
    }
}

export const fetcher = new RestApi({
    baseUrl: BASE_URL,
});

