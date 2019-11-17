import { promises as fs } from 'fs'

import { TOKEN_PATH } from 'config'
import logger from 'common/logger'
import { getOriginalRequestedUrl } from 'middlewares/checkLogin'
import { getAccessToken } from 'services/googleApi'

/**
 * Middleware: Handle google oauth callbacks
 * Assign access token to browser cookie
 * @param {Request} req
 * @param {Respose} res
 */
export const handleCallBacks = async (req, res) => {
  logger.info('Handling Google OAuthClient CallBack')
  logger.info('Requesting Access Token')

  const {
    query: { code }
  } = req

  if (!code) res.redirect(originalRequestedUrl)

  /* Wait for an access token based on our OAuth code */
  const token = await getAccessToken(code)
  if (token) {
    logger.info('Writing Access Token to token.json file')

    try {
      /* Write JSON strigified token in token.js file */
      await fs.writeFile(TOKEN_PATH, JSON.stringify(token))
      logger.info(`Token stored in ${TOKEN_PATH}`)
    } catch (error) {
      logger.error(error, { stacktrace: error.stack })
    }

    /*
    res.cookie('cookieGoogleAccessToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 365
    })
    */

    const originalRequestedUrl = getOriginalRequestedUrl()
    res.redirect(originalRequestedUrl)
  }
}
