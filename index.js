const simpleOauthModule = require('simple-oauth2')
const authMiddleWareInit = require('./auth.js')
const callbackMiddleWareInit = require('./callback')
const oauthProvider = process.env.OAUTH_PROVIDER || 'github'
const loginAuthTarget = process.env.AUTH_TARGET || '_self'

console.log("Starting Netlify CMS OAuth provider...");
console.log("process.env.PORT at startup:", process.env.PORT);

const config = {
  client: {
    id: process.env.OAUTH_CLIENT_ID,
    secret: process.env.OAUTH_CLIENT_SECRET
  },
  auth: {
    // Supply GIT_HOSTNAME for enterprise github installs.
    tokenHost: process.env.GIT_HOSTNAME || 'https://github.com',
    tokenPath: process.env.OAUTH_TOKEN_PATH || '/login/oauth/access_token',
    authorizePath: process.env.OAUTH_AUTHORIZE_PATH || '/login/oauth/authorize'
  }
}

const oauth2 = new simpleOauthModule.AuthorizationCode(config)

function indexMiddleWare (req, res) {
  res.send(`Hello<br>
    <a href="/auth" target="${loginAuthTarget}">
      Log in with ${oauthProvider.toUpperCase()}
    </a>`)
}

const middleware = {
  auth: authMiddleWareInit(oauth2),
  callback: callbackMiddleWareInit(oauth2, oauthProvider),
  success: (req, res) => { res.send('') },
  index: indexMiddleWare
}

// If this file is run directly (not required as a module), start the server
if (require.main === module) {
  require('dotenv').config({ silent: true })
  const express = require('express')
  const port = process.env.PORT || 3000
  
  const app = express()
  
  // Initial page redirecting to Github
  app.get('/auth', middleware.auth)
  
  // Callback service parsing the authorization token
  // and asking for the access token
  app.get('/callback', middleware.callback)
  
  app.get('/success', middleware.success)
  app.get('/', middleware.index)
  
  app.listen(port, () => {
    console.log("Netlify CMS OAuth provider listening on port " + port)
  })
}

module.exports = middleware
