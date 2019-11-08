import { differenceWith, isEqual, isEmpty, keys } from 'loadsh'

import logger from 'common/logger'
import { sendError } from 'handler/response-handler'

/**
 * Check missing query parameters for days, timeslots and booking endpoint
 * @param {http request} req
 * @param {http response} res
 * @param {next} next
 */
export const checkQueryParams = (req, res, next) => {
  logger.info('Checking Query Parameters')
  let queryKeyStrings = []

  /* Check request path and assign query's keys to variable */
  if (req.path === '/days') queryKeyStrings = ['year', 'month']
  else queryKeyStrings = ['year', 'month', 'day']

  /* check if any missing params */
  let allMissingParams = getMissingParams(queryKeyStrings, req.query)
  if (!isEmpty(allMissingParams)) {
    logger.error(`Request is missing parameter: ${allMissingParams}`)
    sendError(res, 501, `Request is missing parameter: ${allMissingParams}`)()
    return
  }

  next()
}

/**
 * Get string of concatinated missing params with comma separator
 * @param {String} queryKeyStrings
 * @param {Request} req
 */
const getMissingParams = (queryKeyStrings, reqQuery) => {
  let tempParams = '' /* prevent undefined with '' */
  const queryKeys = keys(reqQuery) /* Extract array of keys from req's query */

  /* Get missing params by comparing queryKeys with queryKeyStrings */
  const missingParams = differenceWith(queryKeyStrings, queryKeys, isEqual)

  /* Map through missingParams arr and concat them with comma "," */
  missingParams.map((d, i) => {
    tempParams += `${i > 0 ? ', ' : ''}${d}`
  })

  return tempParams
}
