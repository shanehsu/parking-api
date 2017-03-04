import { Request, Response, NextFunction } from "express"
import { ApplicationError } from "./../../../util/error"

export function auth(is: "users" | "admins" | ("users" | "admins")[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method.toLowerCase() == 'options') {
      next()
    } else {
      // 授權目標
      let shouldAllowAdmins = false
      let shouldAllowUsers = false

      if (typeof (is) === 'string') {
        if (is === 'admins') {
          shouldAllowAdmins = true
        } else {
          shouldAllowUsers = true
        }
      } else {
        shouldAllowAdmins = is.includes('admins')
        shouldAllowUsers = is.includes('users')
      }

      // 驗證
      let isUsers = req.header('token') == 'secret_user_token75313'
      let isAdmins = req.header('token') == 'secret_root_token31357'

      if (isUsers && shouldAllowUsers) {
        next()
      } else if (isAdmins && shouldAllowAdmins) {
        next()
      } else {
        next(new ApplicationError("Unauthorized", 401))
      }
    }
  }
}
