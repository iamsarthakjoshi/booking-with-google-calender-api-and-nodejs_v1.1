import { getStartDate, getEndDate } from 'utils'
import {
  makeMonthlyTimeSlotsStatus,
  makeTimeSlotsForGivenDay,
  makeNewAppointment
} from 'services/calendar'

export const getMonthlyTimeSlotsStatus = async (req, res) => {
  const {
    cookies: { token },
    query: { year, month }
  } = req
  const startDate = getStartDate(year, month, 1)
  const endDate = getEndDate(year, month, 0)
  const days = await makeMonthlyTimeSlotsStatus(startDate, endDate)

  res.send({ success: true, days })
}

export const getTimeSlotsForGivenDay = async (req, res) => {
  const {
    query: { year, month, day }
  } = req // date-time requested by the user
  const startTime = getStartDate(year, month, day)
  const endTime = getEndDate(year, month, day)
  const timeslots = await makeTimeSlotsForGivenDay(startTime, endTime)

  res.send({ success: true, timeslots })
}

export const bookNewAppointment = async (req, res) => {
  let {
    query: { year, month, day }
  } = req // booking date-time requested by the user
  const startTime = getStartDate(year, month, day)
  const endTime = getEndDate(year, month, day)
  const newAppointment = await makeNewAppointment(startTime, endTime, req)
  res.send('booknewapp')
  // res.send({ success: newAppointment.isValid, newAppointment.message })
}
