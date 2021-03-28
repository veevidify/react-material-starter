import { readEnv } from "../utils/functions";


const client_id = readEnv('REACT_APP_CLIENT_ID');
const client_secret = readEnv('REACT_APP_CLIENT_SECRET');
const redirect_uri = readEnv('REACT_APP_REDIRECT_URI');
const proxy_url = readEnv('REACT_APP_PROXY_URL');
const oauthUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=${client_id}&redirect_uri=${redirect_uri}`

const config = {
  client_id,
  client_secret,
  redirect_uri,
  proxy_url,
  oauthUrl,
}

export default config;
