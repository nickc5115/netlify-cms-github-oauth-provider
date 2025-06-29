require('dotenv').config({ silent: true })
  console.log("Starting Netlify CMS OAuth provider...");
  console.log("process.env.PORT at startup:", process.env.PORT);
const express = require('express')
const middleWarez = require('./index.js')
const port = process.env.PORT

const app = express()

// Initial page redirecting to Github
app.get('/auth', middleWarez.auth)

// Callback service parsing the authorization token
// and asking for the access token
app.get('/callback', middleWarez.callback)

app.get('/success', middleWarez.success)
app.get('/', middleWarez.index)

console.log("process.env.PORT:", process.env.PORT);
console.log("PORT variable used:", port);

app.listen(port, () => {
  console.log("Netlify CMS OAuth provider listening on port " + port)
})
