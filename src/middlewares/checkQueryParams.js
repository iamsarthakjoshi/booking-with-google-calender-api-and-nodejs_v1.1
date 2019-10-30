import { differenceWith, isEqual, isEmpty, keys } from 'loadsh'
import { msgMissingParams } from 'constants/common'

/**
 * Check missing query parameters for days, timeslots and booking endpoint
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const checkQueryParams = (req, res, next) => {
  let queryKeyStrings = []
  if (req.path === '/days') queryKeyStrings = ['year', 'month']
  else queryKeyStrings = ['year', 'month', 'day']

  const allMissingParams = getMissingParams(queryKeyStrings, req.query)

  // check if any missing params
  if (!isEmpty(allMissingParams)) {
    sendRequest(res, msgMissingParams, allMissingParams)
    return
  }

  next()
}

/**
 * Get string of concatinated missing params with comma separator
 * @param {*} queryKeyStrings
 * @param {*} req
 */
const getMissingParams = (queryKeyStrings, reqQuery) => {
  let tempParams = '' // prevent undefined with ''
  const queryKeys = keys(reqQuery) // extract arr of key values from req's query

  // get missing params by comparing queryKeys with queryKeyStrings
  const missingParams = differenceWith(queryKeyStrings, queryKeys, isEqual)

  // map through missingParams arr and concat them with comma ","
  missingParams.map((d, i) => {
    tempParams += `${i > 0 ? ', ' : ''}${d}`
  })

  return tempParams
}

/**
 * Send request with objects
 * @param {*} msgMissingParams
 * @param {*} allMissingParams
 */
const sendRequest = (res, msgMissingParams, allMissingParams) => {
  res.send({
    success: false,
    message: `${msgMissingParams} ${allMissingParams}`
  })
}
