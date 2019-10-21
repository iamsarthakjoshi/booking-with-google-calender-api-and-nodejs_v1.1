import express from 'express'
import { google } from 'googleapis'

const router = express.Router()

const credentials = {
  "client_id": "200692833635-6dir4ef3c15fhuphe8jnq76ldcjttq32.apps.googleusercontent.com",
  "project_id": "ma-nodejs-1569312384727",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_secret": "QS_SmuC2lHqcjGId1FB8FYJs",
  "redirect_uris": "http://localhost:8081/oauth/callback"
}

const { client_secret, client_id, redirect_uris } = credentials;

const oAuthClient = new google.auth.OAuth2(client_id, client_secret, redirect_uris);


const checkLogin = ((req, res, next) => {
  const { cookies: { token } } = req

  if(!token) {
    const url = oAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/calendar'
    })
    res.redirect(url);
  }
  
  next()
})

router.get('/days', checkLogin, (req, res) => {


  res.send("suman");
})

router.get('/timeslot', checkLogin, (req, res) => {
  res.send("timeslot")
})

router.get('/book', checkLogin, (req, res) => {
  res.send("book")
})

router.get('/oauth/callback', (req, res) => {
  // console.log('called', req)
  const { query: { code } } = req
  if(!code) res.redirect('/')

  // Get an access token based on our OAuth code
  oAuthClient.getToken(code, function(err, token) {
    if (err) {
      res.send(`Error authenticating ${err}`);
    } 
      // Store our credentials and redirect back to our main page
      oAuthClient.setCredentials(token);
      res.cookie('token', token, { 
        maxAge: 1000 * 60 * 60 *24 * 365 
      })
      res.redirect('/'); // TODO: redirect to the referrer
  });
})

module.exports = router;