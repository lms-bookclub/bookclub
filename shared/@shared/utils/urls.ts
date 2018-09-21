export function ensureGoodreadsUrlIsValid(url) {
  if(url.startsWith('goodreads.com')) {
    url = `www.${url}`;
  }
  if(url.startsWith('www.')) {
    url = `https://${url}`;
  }
  return url
}
