import {
  normalize,
  schema
} from 'normalizr';
import axios from 'axios';
import config from '../config';

export const normalizable = (result) => {
  const data = {};
  const extra = {};
  Object.keys(result).forEach((entityName) => {
    const { edges, ...rest } = result[entityName];
    data[entityName] = edges ? edges.map(edge => edge.node) : rest;
    extra[entityName] = rest;
  });
  return { data, extra };
};

function callApi(endpoint, entitySchema, options) {
  const fullUrl = `${config.serverUrl}/api/${endpoint}`;
  const requestOptions = {
    url: fullUrl,
    method: 'get',
    ...options
  };

  return axios(requestOptions)
    .then((response) => {
      /*
        Response example:

        {
          user: User
          posts: [{
            pageInfo
            edges: [{ cursor, Post }]
          }]
        }

        Data to normalize:

        {
          user: User
          posts: [Post]
        }

        Extra:

        {
          user: null
          posts: { pageInfo }
        }
       */
      const { data, extra } = normalizable(response.data);
      const normalized = normalize(data, entitySchema);
      return { response: { ...normalized, ...extra } };
    })
    .catch(response => ({
      error: (response.errors && response.errors[0].message) || 'Something bad happened'
    }));
}

export const getTokenSource = () => {
  const CancelToken = axios.CancelToken;
  return CancelToken.source();
};

const postSchema = new schema.Entity('posts');

const userSchema = new schema.Entity('users');

const postsSchema = [postSchema];

const singlePostSchema = new schema.Object({
  post: postSchema
});

const homeSchema = new schema.Object({
  latestPosts: postsSchema
});

const singleUserSchema = new schema.Object({
  user: userSchema
});

export const fetchPost = ({ id, cancelToken }) => callApi(`posts/${id}`, singlePostSchema, { cancelToken });

export const fetchPosts = ({ cancelToken }) => callApi('posts', postsSchema, { cancelToken });

export const fetchHome = ({ cancelToken }) => callApi('home', homeSchema, { cancelToken });

export const addUser = ({ uid, cancelToken }) =>
  callApi('register', singleUserSchema, {
    method: 'post',
    data: { uid },
    cancelToken
  });
