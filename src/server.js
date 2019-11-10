import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import routes from 'router'
//import logger from 'common/logger'

const app = express()
const PORT = process.env.PORT

app.use(bodyParser.json())
app.use(cookieParser())

app.use('/', routes)

/* Handle 404 errors */
app.use((req, res, next) => {
  const error = new Error('Invalid Request')
  error.status = 400
  next(error)
})

app.use((error, req, res, next) => {
  //logger.error(error.message, { stacktrace: error.stack })
  res.status(error.status || 500)
  res.send({
    error: {
      message: error.message
    }
  })
})

app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`))
