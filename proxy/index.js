/* eslint-disable */

// node proxy/index.js
const express = require('express');
const nodeFetch = require('node-fetch');
const FormData = require('form-data');
const config = require('dotenv').config();

const proxy = express();

proxy.use(express.json());
proxy.use(express.json({ type: 'text/*' }));
proxy.use(express.urlencoded({ extended: false }));

// config strings
const github = {
  clientId: process.env.REACT_APP_GITHUB_CLIENT_ID || null,
  clientSecret: process.env.REACT_APP_GITHUB_CLIENT_SECRET || null,
  redirectUri: process.env.REACT_APP_GITHUB_REDIRECT_URI || null,
  tokenUrl: process.env.REACT_APP_GITHUB_BASE_URL + 'login/oauth/access_token',
  userUrl: process.env.REACT_APP_GITHUB_USER_URL,
};

const custom = {
  clientId: process.env.REACT_APP_CUSTOM_CLIENT_ID || null,
  clientSecret: process.env.REACT_APP_CUSTOM_CLIENT_SECRET || null,
  redirectUri: process.env.REACT_APP_CUSTOM_REDIRECT_URI || null,
  tokenUrl: process.env.REACT_APP_CUSTOM_BASE_URL + 'oauth/token',
  userUrl: process.env.REACT_APP_CUSTOM_USER_URL,
};

// Forwarding Access-Control-Allow-Origin for token requests
proxy.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  next();
});

proxy.post('/authenticate/github', (request, response) => {
  const { code } = request.body;
  const form = new FormData();

  const {
    tokenUrl,
    userUrl,
    clientId,
    clientSecret,
    redirectUri,
  } = github;

  form.append('client_id', clientId);
  form.append('client_secret', clientSecret);
  form.append('redirect_uri', redirectUri);
  form.append('code', code);

  nodeFetch(tokenUrl, {
    method: 'POST',
    body: form,
  })
    .then((res) => res.text())
    .then((paramString) => {
      let params = new URLSearchParams(paramString);
      const accessToken = params.get('access_token');

      return nodeFetch(userUrl, {
        headers: { Authorization: `token ${accessToken}` },
      })
        .then((res) => res.json())
        .then((res) => {
          return response.status(200).json({
            token: accessToken,
            user: res,
          });
        })
        .catch((error) => {
          return response.status(400).json(error);
        });
    })
    .catch((error) => {
      return response.status(400).json(error);
    });
});

proxy.post('/authenticate/custom', (request, response) => {
  const { code } = request.body;
  const form = new URLSearchParams();

  const {
    tokenUrl,
    userUrl,
    clientId,
    clientSecret,
    redirectUri,
  } = custom;

  form.append('client_id', clientId);
  form.append('client_secret', clientSecret);
  form.append('redirect_uri', redirectUri);
  form.append('code', code);
  form.append('grant_type', 'authorization_code');
  form.append('response_type', 'token');

  nodeFetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(clientId + ":" + clientSecret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  })
    .then((res) => res.json())
    .then((paramString) => {
      let params = new URLSearchParams(paramString);
      console.log({ paramString });
      const accessToken = params.get('access_token');

      return nodeFetch(userUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then((res) => {
          return response.status(200).json({
            token: accessToken,
            user: res,
          });
        })
        .catch((error) => {
          return response.status(400).json(error);
        });
    })
    .catch((error) => {
      return response.status(400).json(error);
    });
});

const PORT = process.env.NODE_PROXY_PORT || 5000;
proxy.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT} ...`);
});
