import axios from 'axios';
import Config from 'config';

async function discover(goodreadsUrl) {
  const encoded = encodeURIComponent(goodreadsUrl);

  try {
    const response = await axios({
      method: 'GET',
      url: `http://bookscraps.info/book?goodreads=${encoded}`,
      headers: {
        'Authorization': Config.BOOKSCRAPS_API_KEY,
      },
    });

    const { status, data } = response;

    if(status === 200) {
      return data;
    } else {
      console.log(`Bad response from bookscraps: ${goodreadsUrl}`, status, data);
      return null;
    }
  } catch(err) {
    const { response } = err;
    console.log(`Error calling bookscraps: ${goodreadsUrl}`, err.toString(), response.status, response.data);
    throw err;
  }
}

export default {
  discover,
};