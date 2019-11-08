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

  logger.info('cookieGoogleAccessToken', { token: token })
  logger.info(`Token Expired: ${isTokenExpired(token)}`)

  if (!token || isTokenExpired(token)) {
    logger.warn('User Token Not Found || Token Expired')
    res.redirect(getOAuthClientUrl())
    return
  }

  setOAuthCredentials(token)
  next()
}

const isTokenExpired = (token) => {
  return new Date(token.expiry_Date) < new Date()
}

export const getOriginalRequestedUrl = () => {
  return originalRequestedUrl
}
