import express = require('express')
import mongodb = require('mongodb')
import debug = require('debug')

type Request = express.Request
type Response = express.Response
type NextFunction = express.NextFunction

type MongoClient = mongodb.MongoClient
type Db = mongodb.Db

export class MongoDBMiddleware {
  private uri: string
  private client: MongoClient
  private connectionError: Error | null
  private database: Db | null

  constructor() {
    this.uri = process.env.MONGODB_URI
    this.client = new mongodb.MongoClient()
    this.connectionError = null
    this.database = null

    this.connect()
  }

  async connect() {
    try {
      debug('db')(`開始連線至 ${this.uri}`)
      let db = await this.client.connect(this.uri)
      this.database = db
      this.connectionError = null
    } catch (err) {
      debug('db')(`連線失敗，原因：${err.message}`)
      this.connectionError = err
      setTimeout(() => { this.connect() }, 1000)
    }
  }

  get middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.method.toLowerCase() == 'options') {
        next()
      } else if (this.database === null) {
        res.status(500).json({
          "message": "資料庫尚未就緒。"
        })
      } else {
        req.db = this.database
        next()
      }
    }
  }
}
