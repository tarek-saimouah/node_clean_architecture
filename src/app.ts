import config from './config'
import express from 'express'
import { createServer } from 'http'
import helmet from 'helmet'
import cors from 'cors'
import router from './application/routes'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const CLIENT_URL = config.CLIENT_URL || '*'
app.use(
  cors({
    origin: CLIENT_URL,
  })
)

app.use(helmet())
app.use(router)

// for socket io server (if used)
const httpServer = createServer(app)

export default httpServer
