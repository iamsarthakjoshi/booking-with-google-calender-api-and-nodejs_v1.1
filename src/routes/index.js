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

router.get('/days', checkLogin, checkQueryParams, getMonthlyTimeSlotsStatus)

router.get('/timeslots', checkLogin, checkQueryParams, getTimeSlotsForGivenDay)

router.get('/book', checkLogin, checkQueryParams, bookNewAppointment)

router.get('/oauth/callback', handleCallBacks)

module.exports = router
