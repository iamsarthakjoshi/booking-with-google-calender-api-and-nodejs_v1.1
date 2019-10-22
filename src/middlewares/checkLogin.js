import { setOAuthCredentials, getOAuthClientUrl } from 'services/googleApi'

let originalRequestedUrl

export const checkLogin = ((req, res, next) => {
  const { cookies: { token }, originalUrl } = req
  
  originalRequestedUrl = originalUrl
  
  if(!token) {
    res.redirect(getOAuthClientUrl())
    return
  }
  setOAuthCredentials(token)
  next()
})

export const getOriginalRequestedUrl = () => {
  return originalRequestedUrl
}