import express from 'express'

import { getMonthlyTimeSlotStatus } from 'controllers/appointment'

const router = express.Router()

const checkLogin = ((req, res, next) => {
  const { cookies: { token } } = req

  // if(!token) {
  //   const url = oAuthClient.generateAuthUrl({
  //     access_type: 'offline',
  //     scope: 'https://www.googleapis.com/auth/calendar'
  //   })
  //   res.redirect(url);
  // }

  next()
})

router.get('/days', checkLogin, getMonthlyTimeSlotStatus)

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
      console.log(token, 'TOKEN');
      // oAuthClient.setCredentials(token);
      res.cookie('token', token, { 
        maxAge: 1000 * 60 * 60 *24 * 365 
      })
      res.redirect('/'); // TODO: redirect to the referrer
  });
})

module.exports = router;