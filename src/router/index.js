import express from 'express'

import { checkLogin } from 'middlewares/checkLogin'
import { checkQueryParams } from 'middlewares/checkQueryParams'
import { handleCallBacks } from 'middlewares/redirectOAuthCallbacks'
import {
  getMonthlyTimeSlotsStatus,
  getTimeSlotsForGivenDay,
  bookNewAppointment
} from 'controllers/appointment'

const router = express.Router()
const redirectEndPoint = process.env.GOOGLE_REDIRECT_END_POINT // OAuth Redirect End-Point

router.get('/days', checkLogin, checkQueryParams, getMonthlyTimeSlotsStatus)

router.get('/timeslots', checkLogin, checkQueryParams, getTimeSlotsForGivenDay)

router.get('/book', checkLogin, checkQueryParams, bookNewAppointment)

router.get(redirectEndPoint, handleCallBacks)

/* Handle browser's favicon.ico request */
router.get('/favicon.ico', (req, res) => res.status(204))

module.exports = router
