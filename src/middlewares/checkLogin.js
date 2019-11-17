import { promises as fs } from 'fs'

import { TOKEN_PATH } from 'config'
import logger from 'common/logger'
import { throwError } from 'handler/error-handler'
import { setOAuthCredentials, getOAuthClientUrl } from 'services/googleApi'

let originalRequestedUrl

/**
 * Middleware that checks cookie and token expiry
 * @param {Request} req
 * @param {Reponse} res
 * @param {next} next
 */
export const checkLogin = async (req, res, next) => {
  logger.info('Authenticating User Token')

  const {
    /* cookies: { cookieGoogleAccessToken }, */
    originalUrl
  } = req

  /* const token = cookieGoogleAccessToken */
  originalRequestedUrl = originalUrl

  /**
   * File Approach
   * Check existence of token.json file
   * and read the file
   */
  try {
    /* Check if the token file exists  */
    await fs.access(TOKEN_PATH, fs.F_OK, (error) => {
      throwError(501, 'I/O Error', error)()
    })

    logger.info(`Reading token file from ${TOKEN_PATH}`)
    const token = await fs.readFile(TOKEN_PATH)

    setOAuthCredentials(JSON.parse(token))
    next()
  } catch (error) {
    logger.error('Error reading token.js', { stacktrace: error.stack })
    res.redirect(getOAuthClientUrl())
  }

  /**
   * Cookie Approach
   * Check cookie containing tooken, Also
   * if Token is expired if cookie exist
   */
  /*
  if (!token || (token && isTokenExpired(token))) {
    logger.warn('Cookie Token Not Found || Token Expired')
    logger.info('Redirecting to Google OAuth Conset page')
    res.redirect(getOAuthClientUrl())
    return
  }
  */
}

const isTokenExpired = (token) => {
  return new Date(token.expiry_date) < new Date()
}

export const getOriginalRequestedUrl = () => {
  return originalRequestedUrl
}
