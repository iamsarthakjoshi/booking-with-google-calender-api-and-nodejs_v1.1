import logger from 'utils/logger'
import { setOAuthCredentials, getOAuthClientUrl } from 'services/googleApi'

let originalRequestedUrl

export const checkLogin = (req, res, next) => {
  logger.info('Authenticating User Token')
  const {
    cookies: { token },
    originalUrl
  } = req

  originalRequestedUrl = originalUrl

  if (!token) {
    logger.warn('User Token Not Found')
    res.redirect(getOAuthClientUrl())
    return
  }

  setOAuthCredentials(token)
  next()
}

export const getOriginalRequestedUrl = () => {
  return originalRequestedUrl
}
