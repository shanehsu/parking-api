export class ApplicationError extends Error {
  statusCode: number
  raw?: Error
  constructor(message: string, statusCode: number, raw?: Error) {
    super(message)

    this.statusCode = statusCode
    this.raw = raw
  }
}