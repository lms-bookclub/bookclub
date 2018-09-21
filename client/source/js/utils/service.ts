import LoggerService from 'services/LoggerService';
import { mapMongoList } from 'utils/fn';

type FetchOptions = {
  method?: string;
  url?: string;
  query?: any;
  headers?: { [key: string]: string };
  shouldAcceptStatus?: (status: number) => boolean;
  fields?: string[];
  errorMessage?: string;
  data?: any;
}

export function appendQueryString(url: string, queryParams: object) {
  let symbol = url.indexOf('?') === -1 ? '?' : '&';
  Object.keys(queryParams).forEach(key => {
    const value = queryParams[key];
    if(value !== undefined && value !== null) {
      url += `${symbol}${key}=${encodeURIComponent(value)}`;
      symbol = '&';
    }
  });
  return url;
}

/**
 *
 * @param {(number) => boolean} shouldAcceptStatus
 * @returns {(response) => any}
 */
function checkResponseStatus(shouldAcceptStatus) {
  return (response) => {
    if(shouldAcceptStatus(response.status)) {
      return response.json();
    } else {
      throw `Invalid response status ${response.status}`
    }
  }
}

/**
 * Abstract list fetch implementation
 * @param {string} baseUrl
 * @param options
 * @returns {Promise}
 */
export function fetchAll(baseUrl: string, options?: FetchOptions) {
  options = Object.assign({
    query: {},
    errorMessage: `Error fetching list from ${baseUrl}`,
    shouldAcceptStatus: _ => _ === 200,
  }, options);

  if(Array.isArray(options.query)) {
    options.query = {
      '_id': options.query
    }
  }

  let url = appendQueryString(`${options.url || baseUrl}`, {
    ...options.query,
    fields: options.fields,
  });

  return fetch(url, { credentials: 'include' })
    .then(checkResponseStatus(options.shouldAcceptStatus))
    .then(json => mapMongoList(json))
    .catch((err) => {
      LoggerService.error(options.errorMessage, err);
    });
}

/**
 * Abstract single item fetch implementation
 * @param {string} baseUrl
 * @param {string} id
 * @param options
 * @returns {Promise}
 */
export function fetchOne(baseUrl: string, id: string, options?: FetchOptions) {
  options = Object.assign({
    errorMessage: `Error fetching data from ${baseUrl}`,
    shouldAcceptStatus: _ => _ === 200,
  }, options);

  const url = options.url || `${baseUrl}/${id}`;

  return fetch(url, { credentials: 'include' })
    .then(checkResponseStatus(options.shouldAcceptStatus))
    .catch((err) => {
      LoggerService.error(options.errorMessage, err);
    });
}

/**
 * Abstract create implementation
 * @param baseUrl
 * @param data
 * @param options
 * @returns {Promise}
 */
export function create(baseUrl, data, options: FetchOptions) {
  options = Object.assign({
    headers: {
      'Content-Type': 'application/json'
    },
    errorMessage: `Error posting data to ${baseUrl}`,
    shouldAcceptStatus: _ => _ === 201,
  }, options);

  const url = options.url || `${baseUrl}`;

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: options.headers,
    body: JSON.stringify(data),
  })
    .then(checkResponseStatus(options.shouldAcceptStatus))
    .catch((err) => {
      LoggerService.error(options.errorMessage, err);
    });
}

/**
 * Abstract update
 * @param baseUrl
 * @param {string} id
 * @param data
 * @param options
 * @returns {Promise}
 */
export function update(baseUrl, id: string, data, options: FetchOptions) {
  options = Object.assign({
    headers: {
      'Content-Type': 'application/json'
    },
    errorMessage: `Error updating data at ${baseUrl}`,
    shouldAcceptStatus: _ => _ === 200,
  }, options);

  const url = options.url || `${baseUrl}/${id}`;

  return fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: options.headers,
    body: JSON.stringify(data),
  })
    .then(checkResponseStatus(options.shouldAcceptStatus))
    .catch((err) => {
      LoggerService.error(options.errorMessage, err);
    });
}

/**
 * Abstract replace
 * @param baseUrl
 * @param {string} id
 * @param data
 * @param options
 * @returns {Promise}
 */
export function replace(baseUrl, id: string, data, options: FetchOptions) {
  options = Object.assign({
    headers: {
      'Content-Type': 'application/json'
    },
    errorMessage: `Error replacing data at ${baseUrl}`,
    shouldAcceptStatus: _ => _ === 200,
  }, options);

  const url = options.url || `${baseUrl}/${id}`;

  return fetch(url, {
    method: 'PUT',
    credentials: 'include',
    headers: options.headers,
    body: JSON.stringify(data),
  })
    .then(checkResponseStatus(options.shouldAcceptStatus))
    .catch((err) => {
      LoggerService.error(options.errorMessage, err);
    });
}

export function destroy(baseUrl, id: string, options: FetchOptions) {
  options = Object.assign({
    headers: {
      'Content-Type': 'application/json'
    },
    errorMessage: `Error deleting data at ${baseUrl}`,
    shouldAcceptStatus: _ => _ === 204,
  }, options);

  const url = options.url || `${baseUrl}/${id}`;

  return fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: options.headers,
  })
    .then(checkResponseStatus(options.shouldAcceptStatus))
    .catch((err) => {
      LoggerService.error(options.errorMessage, err);
    });
}

export function fetch_(url, options: FetchOptions) {
  if (!url) {
    throw 'Cannot fetch without a URL.'
  }
  if (!options.method) {
    console.warn('Fetching without a method: ', url);
    console.trace();
    options.method = 'GET';
  }

  options = Object.assign({
    headers: {
      'Content-Type': 'application/json'
    },
    errorMessage: `XHR Error: ${options.method} ${url}`,
    shouldAcceptStatus: _ => _ === 200,
  }, options);

  if(options.query) {
    url = appendQueryString(url, {
      ...options.query,
    });
  }

  const fetchConfig: any = {
    method: options.method,
    credentials: 'include',
    headers: options.headers,
  };

  if(options.data) {
    fetchConfig.body = JSON.stringify(options.data);
  }

  return fetch(url, fetchConfig)
    .then(checkResponseStatus(options.shouldAcceptStatus))
    .catch((err) => {
      LoggerService.error(options.errorMessage, err);
    });
}
