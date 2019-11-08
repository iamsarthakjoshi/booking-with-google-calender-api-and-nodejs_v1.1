import { isEmpty } from 'loadsh'

import { sendSuccess, sendError } from 'handler/response-handler'
import { getStartDate, getEndDate, getDateTime, getEndDateTime } from 'utils'
import {
  makeMonthlyTimeSlotsStatus,
  makeTimeSlotsForGivenDay,
  makeNewAppointment
} from 'services/calendar'

/**
 * Get Monthly TimeSlots Status and send corresponding response
 * @param {Resquest} req
 * @param {Response} res
 */
export const getMonthlyTimeSlotsStatus = async (req, res) => {
  try {
    const {
      query: { year, month }
    } = req /* Year and month requested by the user */

    const startDate = getStartDate(year, month, 1)
    const endDate = getEndDate(year, month, 0)

    const days = await makeMonthlyTimeSlotsStatus(startDate, endDate)

    sendSuccess(res, 'days')({ days: days })
  } catch (error) {
    sendError(res, error.code, error.message)(error)
  }
}

/**
 * Get TimeSlots for given day and send corresponding response
 * @param {Resquest} req
 * @param {Response} res
 */
export const getTimeSlotsForGivenDay = async (req, res) => {
  try {
    const {
      query: { year, month, day }
    } = req /* date-time requested by the user */

    /* Set time between every hours in 24 hour */
    const startTime = getDateTime(year, month, day, 0, 0)
    const endTime = getDateTime(year, month, day, 23, 59)

    const timeSlots = await makeTimeSlotsForGivenDay(startTime, endTime)
    sendSuccess(res, 'timeSlots')(
      isEmpty(timeSlots)
        ? {
            timeSlots: timeSlots,
            message: 'No time slots available at the moment'
          }
        : { timeSlots: timeSlots }
    )
  } catch (error) {
    sendError(res, error.code, error.message)(error)
  }
}

/**
 * Book new appointment time for requested date-time
 * and send corresponding reponse
 * @param {Resquest} req
 * @param {Response} res
 */
export const bookNewAppointment = async (req, res) => {
  try {
    let {
      query: { year, month, day, hour, minute }
    } = req /* Booking date-time requested by the user */

    const startTime = getDateTime(year, month, day, hour, minute)
    const endTime = getEndDateTime(year, month, day, hour, minute)

    const bookedTimeSlot = await makeNewAppointment(startTime, endTime)
    sendSuccessForBooking(res, 'booking')(bookedTimeSlot)
  } catch (error) {
    sendError(res, error.code, error.message)()
  }
}
