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
    private client: RedisClient
    private connectionError: Error | null
    private port: number
    private host: string
    private url: string

    constructor() {
        this.connectionError = null
        this.host = "127.0.0.1"
        this.port = 6000
        this.connect()
    }

    async connect() {
        try {
            debug('redis')(`${this.client}開始連線Redis`)
            let _client = await redis.createClient(this.port, this.host)
            if (_client.connected === true) {
                this.client = _client
                debug('redis')(`${this.client}連線成功`)
                this.connectionError = null
            }
        } catch (err) {
            debug('redis')(`連線失敗，原因：${err.message}`)
            this.connectionError = err
            setTimeout(() => { this.connect() }, 1000)
        }
    }
    get middleware() {
        return (req: Request, res: Response, next: NextFunction) => {
            //req.client = this.client
            req.client = this.client
            next()
        }
    }
}
