const express = require('express');
const nodeFetch = require('node-fetch');
const FormData = require('form-data');
const config = require('dotenv').config();

const proxy = express();

proxy.use(express.json());
proxy.use(express.json({ type: "text/*" }));
proxy.use(express.urlencoded({ extended: false }));

// config strings
const clientId = process.env.REACT_APP_CLIENT_ID || null;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET || null;
const redirectUri = process.env.REACT_APP_REDIRECT_URI || null;

if (!clientId || !clientSecret || !redirectUri) {
  throw new Error('Missing configurations');
}

// Forwarding Access-Control-Allow-Origin for token requests
proxy.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  next();
});

proxy.post('/authenticate', (request, response) => {
  const { code } = request.body;
  const form = new FormData();

  form.append('client_id', clientId);
  form.append('client_secret', clientSecret);
  form.append('redirect_uri', redirectUri);
  form.append('code', code);

  nodeFetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    body: form,
  })
  .then(res => res.text())
  .then(paramString => {
    let params = new URLSearchParams(paramString);
    const accessToken = params.get('access_token');

    return nodeFetch('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` },
    })
    .then(res => res.json())
    .then(res => {
      return response.status(200).json({
        token: accessToken,
        user: res,
      });
    })
    .catch(error => {
      return response.status(400).json(error);
    });
  })
  .catch(error => {
    return response.status(400).json(error);
  });
});

const PORT = process.env.NODE_PROXY_PORT || 5000;
proxy.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT} ...`);
});
