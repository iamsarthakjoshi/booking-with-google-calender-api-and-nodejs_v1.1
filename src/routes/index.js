import express from 'express'

import { checkLogin } from 'middlewares/checkLogin'
import { handleCallBacks } from 'middlewares/handleOAuthCallbacks'
import 
{ 
  getMonthlyTimeSlotsStatus,
  getTimeSlotsForGivenDay,
  bookNewAppointment
} from 'controllers/appointment'

const router = express.Router()

router.get('/days', checkLogin, getMonthlyTimeSlotsStatus)

router.get('/timeslot', checkLogin, getTimeSlotsForGivenDay)

router.get('/book', checkLogin, bookNewAppointment)

router.get('/oauth/callback', handleCallBacks)

module.exports = router;