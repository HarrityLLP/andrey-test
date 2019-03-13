const httpClient = {
  interceptors: [],
  get: async url => {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Cache: 'no-cache'
      }
    };

    const response = await fetch(url, options);
    httpClient.interceptors.forEach(f => f(response.status));
    if (response.status >= 400) {
      throw response;
    }
    let responseBody;
    try {
      responseBody = await response.json();
    } catch (e) {
      responseBody = '';
    }
    return responseBody;
  },
  post: async (url, data) => {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Cache: 'no-cache'
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }
    const response = await fetch(url, options);
    httpClient.interceptors.forEach(f => f(response.status));
    if (response.status >= 400) {
      let message;
      try {
        message = await response.json();
      } catch {
        message = response.statusText;
      }
      throw message;
    }
    let responseBody;
    try {
      responseBody = await response.json();
    } catch (e) {
      responseBody = '';
    }
    return responseBody;
  },

  addInterceptor: f => {
    httpClient.interceptors.push(f);
  }
};

export default httpClient;
