import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import routes from 'routes'

const app = express()
const PORT = 8081



app.use(bodyParser.json())
app.use(cookieParser())

app.use('/', routes)

app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`))