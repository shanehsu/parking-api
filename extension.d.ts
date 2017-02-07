import { Db } from 'mongodb'

declare global {
  module Express {
    export interface Request {
      db: Db
    }
  }
}
