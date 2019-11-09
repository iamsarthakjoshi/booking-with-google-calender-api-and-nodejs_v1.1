/**
 * Send response with status:200, success value and
 * success message for each type of request
 * @param {Response} res
 * @param {Request Type} reqType
 */
export const sendSuccess = (res, reqType) => (data) => {
  let { timeSlots, message, startTime, endTime } = data

  if (reqType === 'timeSlots')
    res.status(200).json({ success: true, timeSlots, message })
  else if (reqType === 'booking')
    res.status(200).json({ success: true, startTime, endTime })
  else res.status(200).json({ success: true, data })
}

/**
 * Send response with either 501 status code or user defined
 * error code with success value and failed message
 * @param {Response} res
 * @param {Error Code} statusCode
 * @param {Error Message} message
 */
export const sendError = (res, statusCode, message) => (error) => {
  res.status(statusCode || 501).json({
    success: false,
    message: message || error.message,
    error
  })
}
