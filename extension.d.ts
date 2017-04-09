import { Db } from 'mongodb'
import { RedisClient } from 'redis'

declare global {
  module Express {
    export interface Request {
      db: Db
      client: RedisClient
    }
  }
}
