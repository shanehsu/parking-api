import express = require('express')
import redis = require('redis')
import debug = require('debug')

/*
In RESP, the type of some data depends on the first byte:
For Simple Strings the first byte of the reply is "+"
For Errors the first byte of the reply is "-"
For Integers the first byte of the reply is ":"
For Bulk Strings the first byte of the reply is "$"
For Arrays the first byte of the reply is "*"
*/

type Request = express.Request
type Response = express.Response
type NextFunction = express.NextFunction

type RedisClient = redis.RedisClient

export class RedisMiddleware {
  private client: RedisClient | null = null
  private connectionError: Error | null
  private url: string

  constructor() {
    this.connectionError = null
    this.url = process.env.REDIS_URL
    this.connect()
  }

  connect() {
    debug('redis')(`開始連線Redis`)
    let _client = redis.createClient(this.url)

    _client.on('ready', () => {
      this.client = _client
      debug('redis')(`連線成功`)
      this.connectionError = null
    })
    _client.on('error', (err: any) => {
      debug('redis')(`連線失敗，原因：${err.message}`)
      this.connectionError = err
    })
    _client.on('reconnecting', () => {
      debug('redis')(`重新連建中`)
      this.connectionError = new Error('Redis 重新連線中')
    })
  }
  get middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.method.toLowerCase() == 'options') {
        next()
      } else if (this.connectionError !== null) {
        res.status(500).json({
          "message": "Redis 資料庫尚未就緒。"
        })
      } else if (this.client !== null) {
        req.client = this.client
        next()
      } else {
        next(new Error('Redis 未知的錯誤'))
      }
    }
  }
}
