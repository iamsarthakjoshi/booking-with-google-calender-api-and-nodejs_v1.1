import { getOriginalRequestedUrl } from 'middlewares/checkLogin'
import { getAccessToken } from 'services/googleApi'

export const handleCallBacks = async (req, res) => {
  const {
    query: { code }
  } = req
  const originalRequestedUrl = getOriginalRequestedUrl()

  if (!code) res.redirect(originalRequestedUrl)

  /* Get an access token based on our OAuth code */
  const token = await getAccessToken(code)
  if (token) {
    console.log('TOken', token)
    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 365
    })
    res.redirect(originalRequestedUrl)
  }
}
