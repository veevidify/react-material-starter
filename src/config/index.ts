import { readEnv } from '../utils/functions';

const githubClientId = readEnv('REACT_APP_GITHUB_CLIENT_ID');
const githubClientSecret = readEnv('REACT_APP_GITHUB_CLIENT_SECRET');
const githubRedirectUri = readEnv('REACT_APP_GITHUB_REDIRECT_URI');
const githubProxyUrl = readEnv('REACT_APP_GITHUB_PROXY_URL');
const githubOAuthUrl =
  readEnv('REACT_APP_GITHUB_BASE_URL') +
  `login/oauth/authorize?scope=user&client_id=${githubClientId}&redirect_uri=${githubRedirectUri}`;

const customClientId = readEnv('REACT_APP_CUSTOM_CLIENT_ID');
const customClientSecret = readEnv('REACT_APP_CUSTOM_CLIENT_SECRET');
const customRedirectUri = readEnv('REACT_APP_CUSTOM_REDIRECT_URI');
const customProxyUrl = readEnv('REACT_APP_CUSTOM_PROXY_URL');

const customOAuthUrl =
  readEnv('REACT_APP_CUSTOM_BASE_URL') +
  `oauth/authorize?scope=*&client_id=${customClientId}&redirect_uri=${customRedirectUri}&grant_type=authorization_code&response_type=code`;

const config = {
  githubClientId,
  githubClientSecret,
  githubRedirectUri,
  githubProxyUrl,
  githubOAuthUrl,
  customClientId,
  customClientSecret,
  customRedirectUri,
  customProxyUrl,
  customOAuthUrl,
};

export default config;
