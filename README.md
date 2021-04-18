## Contents
- [Contents](#contents)
- [1. Overview](#1-overview)
- [2. Overmind & Cookie auth (for token)](#2-overmind--cookie-auth-for-token)
- [3. Login with github](#3-login-with-github)
- [4. Custom idp](#4-custom-idp)

---

## 1. Overview
- React app bootstrapped with CRA with Typescript4 template.
- Develop with `node` 12 and `yarn`
```sh
$ nvm use 12
$ yarn
```
- Use `material-ui@5` (material-ui@next at the time) for view components.
- Sample dashboard code based on https://github.com/mui-org/material-ui/tree/next/docs/src/pages/getting-started/templates/dashboard and https://github.com/devias-io/material-kit-react.
- Integrate `overmind` for effectful code and general app state management.
- Use cookie for auth details persistence.
- "Login with X" examples with github and a custom idp.

---

## 2. Overmind & Cookie auth (for token)
- `overmind` is implemented with namespaces (modularised).
- `overmind/{namespace}/effect.ts` are effectful code (contact backend wapi, use browser api, etc.).
- Basic `auth` tests (in `overmind/auth/actions.test.ts`) and `husky` pre-commit hooks (`./husky`) are set up.

## 3. Login with github
- To use this feature, set up `.env` to fit your local development environment:
```sh
$ cp .env.example .env
```
- Edit the `.env` accordingly
```env
REACT_APP_GITHUB_BASE_URL=https://github.com/
REACT_APP_GITHUB_USER_URL=https://api.github.com/user
REACT_APP_GITHUB_CLIENT_ID=#your github oauth2 app creds
REACT_APP_GITHUB_CLIENT_SECRET=#your github oauth2 app creds
REACT_APP_GITHUB_REDIRECT_URI=http://localhost:3000/login?idp=github
REACT_APP_GITHUB_PROXY_URL=http://localhost:5000/authenticate/github
```
- Start the proxy
```sh
$ node proxy/index.js
```
- Mainly based on this tutorial: https://levelup.gitconnected.com/how-to-implement-login-with-github-in-a-react-app-bd3d704c64fc

## 4. Custom idp
- If you have your own OAuth2 server to integrate with, you can configure the "Login with our idp" feature to work.
- This example setup is to use alongside another project of mine: https://github.com/veevidify/nestjs-oauth-server.
- To test the flow using this dashboard and `nestjs-oauth-server` app, start the server first (port 3000)
- Edit the `.env`:
```env
REACT_APP_CUSTOM_BASE_URL=http://localhost:3000/
REACT_APP_CUSTOM_USER_URL=http://localhost:3000/auth/profile
REACT_APP_CUSTOM_CLIENT_ID=testid
REACT_APP_CUSTOM_CLIENT_SECRET=testsecret
REACT_APP_CUSTOM_REDIRECT_URI=http://localhost:3000/login?idp=custom
REACT_APP_CUSTOM_PROXY_URL=http://localhost:5000/authenticate/custom
```
