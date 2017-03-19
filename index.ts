import * as express from "express"
import * as body_parser from 'body-parser'
import * as mongodb from 'mongodb'
import * as morgan from 'morgan'
import * as debug from 'debug'
import * as cors from 'cors'

import { MongoDBMiddleware } from './mongo'
import { apiRouter } from './api/apiRouter'
import { checkFbRouter } from './fbLogin-api/fbRouter'
import { ApplicationError } from './util/error'


let port: number = Number.parseInt(process.env.PORT) || 5000

let app = express()

// 用 morgan 記錄要求
app.use(morgan('dev'))

app.use('/app', express.static(__dirname + '/app'))
app.use('/admin', express.static(__dirname + '/admin'))

app.use(cors())
app.use(body_parser.json())
app.use(new MongoDBMiddleware().middleware)

app.use('/api', apiRouter)

app.get('/', (req, res) => {
  res.send('資料庫已經連線')
})

app.use('/facebook', checkFbRouter)

app.use((err: ApplicationError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.statusCode || 500).send({
    message: err.message,
    raw: err.raw
  })
})

app.listen(port, () => {
  debug('app')(`應用程式正在監聽傳輸埠 ${port}`)
})

