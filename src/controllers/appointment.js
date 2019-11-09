import { isEmpty } from 'loadsh'

import logger from 'common/logger'
import { sendSuccess, sendError } from 'handler/response-handler'
import {
  getStartDate,
  getEndDate,
  getDateTime,
  getEndDateTime
} from 'common/utils'
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
  logger.info('Serving /days request', req.query)

  try {
    const {
      query: { year, month }
    } = req /* Year and month requested by the user */

    const startDate = getStartDate(year, month, 1)
    const endDate = getEndDate(year, month, 0)

    const days = await makeMonthlyTimeSlotsStatus(startDate, endDate)

    logger.info('Timeslots status for each day are fetched!')
    sendSuccess(res, 'days')({ days: days })
  } catch (error) {
    logger.error(error.message, { stacktrace: error.stack })
    sendError(res, error.code, error.message)()
  }
}

/**
 * Get TimeSlots for given day and send corresponding response
 * @param {Resquest} req
 * @param {Response} res
 */
export const getTimeSlotsForGivenDay = async (req, res) => {
  logger.info('Serving /timeslots request with', req.query)

  try {
    const {
      query: { year, month, day }
    } = req /* date-time requested by the user */

    /* Set time between every hours in 24 hour */
    const startTime = getDateTime(year, month, day, 0, 0)
    const endTime = getDateTime(year, month, day, 23, 59)

    const timeSlots = await makeTimeSlotsForGivenDay(startTime, endTime)
    logger.info('Timeslots are fetched!')
    sendSuccess(res, 'timeSlots')(
      isEmpty(timeSlots)
        ? {
            timeSlots: timeSlots,
            message: 'No time slots available at the moment'
          }
        : { timeSlots: timeSlots }
    )
  } catch (error) {
    logger.error(error.message, { stacktrace: error.stack })
    sendError(res, error.code, error.message)()
  }
}

/**
 * Book new appointment time for requested date-time
 * and send corresponding reponse
 * @param {Resquest} req
 * @param {Response} res
 */
export const bookNewAppointment = async (req, res) => {
  logger.info('Serving /book request with', req.query)

  try {
    let {
      query: { year, month, day, hour, minute }
    } = req /* Booking date-time requested by the user */

    const startTime = getDateTime(year, month, day, hour, minute)
    const endTime = getEndDateTime(year, month, day, hour, minute)

    const bookedTimeSlot = await makeNewAppointment(startTime, endTime)

    logger.info('Appointment booked!', bookedTimeSlot)
    sendSuccess(res, 'booking')(bookedTimeSlot)
  } catch (error) {
    logger.error(error.message, { stacktrace: error.stack })
    sendError(res, error.code, error.message)()
  }
}
