import { getStartDate, getEndDate, getDateTime, getEndDateTime } from 'utils'
import {
  makeMonthlyTimeSlotsStatus,
  makeTimeSlotsForGivenDay,
  makeNewAppointment
} from 'services/calendar'

/**
 *
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
export const getMonthlyTimeSlotsStatus = async (req, res) => {
  const {
    query: { year, month }
  } = req /* Year and month requested by the user */

  const startDate = getStartDate(year, month, 1)
  const endDate = getEndDate(year, month, 0)

  const days = await makeMonthlyTimeSlotsStatus(startDate, endDate)

  res.send({ success: true, days })
}

export const getTimeSlotsForGivenDay = async (req, res) => {
  const {
    query: { year, month, day }
  } = req /* date-time requested by the user */

  /* Set time between every hours in 24 hour */
  const startTime = getDateTime(year, month, day, 0, 0)
  const endTime = getDateTime(year, month, day, 23, 59)

  const timeslots = await makeTimeSlotsForGivenDay(startTime, endTime)

  res.send({ success: true, timeslots })
}

export const bookNewAppointment = async (req, res) => {
  let {
    query: { year, month, day, hour, minute }
  } = req /* Booking date-time requested by the user */

  const startTime = getDateTime(year, month, day, hour, minute)
  const endTime = getEndDateTime(year, month, day, hour, minute)

  const isBooked = await makeNewAppointment(startTime, endTime)
  const { status, result } = isBooked

  let output = {}

  if (status) {
    output.success = true
    output.startTime = result.startDate
    output.endTime = result.endTime
  } else {
    output.success = false
    output.message = result
  }
  res.send(output)
}
