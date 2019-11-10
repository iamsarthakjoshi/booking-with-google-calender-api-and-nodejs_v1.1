import logger from 'common/logger'
import { setOAuthCredentials, getOAuthClientUrl } from 'services/googleApi'

let originalRequestedUrl

/**
 * Middleware that checks cookie and token expiry
 * @param {Request} req
 * @param {Reponse} res
 * @param {next} next
 */
export const checkLogin = (req, res, next) => {
  logger.info('Authenticating User Token')

  const {
    cookies: { cookieGoogleAccessToken },
    originalUrl
  } = req

  originalRequestedUrl = originalUrl
  const token = cookieGoogleAccessToken

  /**
   * Check cookie containing tooken, Also
   * if Token is expired if cookie exist
   */
  if (!token || (token && isTokenExpired(token))) {
    logger.warn('Cookie Token Not Found || Token Expired', {
      isTokenExpired: isTokenExpired(token)
    })
    res.redirect(getOAuthClientUrl())
    return
  }

  setOAuthCredentials(token)
  next()
}

const isTokenExpired = (token) => {
  return new Date(token.expiry_date) < new Date()
}

export const getOriginalRequestedUrl = () => {
  return originalRequestedUrl
}
