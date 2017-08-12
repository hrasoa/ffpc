import url from 'url';
import express from 'express';
import axios from 'axios';


const router = express.Router();


async function getPaginated(url, params = {}) {
  const perPage = parseInt(params.query && params.query._perPage || 10, 10);
  const page = parseInt(params.query && params.query._page || 1, 10);
  const start = (page - 1) * perPage;
  try {
    const response = await axios.get(url);
    const data = response.data.slice(start, start + perPage);
    if (params.query && params.query.fl) {
      return data.map(item => params.query.fl.split(',').reduce((acc, field) => {
        acc[field] = item[field];
        return acc;
      }, {}));
    }
    return data;
  } catch(e) {
    return [];
  }
}


const getPosts = getPaginated.bind(null, 'https://jsonplaceholder.typicode.com/posts');
const getPictures = getPaginated.bind(null, 'https://unsplash.it/list');


router.get('/posts', async (req, res) => {
  const data = await getPosts(url.parse(req.url, true));
  res.json(data);
});


router.get('/posts/:id', async (req, res) => {
  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${req.params.id}`)
      .catch((error) => { throw new Error(error); });
    res.json(response.data);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
});


router.get('/pictures', async (req, res) => {
  const data = await getPictures(url.parse(req.url, true));
  res.json(data);
});


router.get('/home', async (req, res) => {
  const posts = getPosts({ query: { fl: 'id,title' } });
  const pictures = getPictures({ query: { fl: 'id,filename' } });
  const latestPosts = await posts;
  const latestPictures = await pictures;
  res.json({ latestPosts, latestPictures });
});


router.post('/login', (req, res) => {
  try {
    if (req.body.password !== '123') {
      throw new Error('Invalid password');
    }
    res.json({
      id: 809090,
      username: req.body.username,
      firstName: 'Dummy first name'
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});


export default router;
