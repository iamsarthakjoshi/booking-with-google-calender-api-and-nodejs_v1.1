/**
 * Throw new Error with error status code, type and message
 * @param {Error Code} code
 * @param {Error Type} errorType
 * @param {Error Message} errorMessage
 */
export const throwError = (code, errorType, errorMessage) => (error) => {
  if (!error) error = new Error(errorMessage || 'Error Occured')
  error.code = code
  error.errorType = errorType
  throw error
}

/**
 * Receive function to determine and call throwError()
 * @param {Function} fn
 * @param {Error Code} code
 * @param {Error Type} errorType
 * @param {Error Message} errorMessage
 */
export const throwIf = (fn, code, errorType, errorMessage) => (result) => {
  if (fn(result)) {
    return throwError(code, errorType, errorMessage)()
  }
  return result
}
