import { Request, Response, NextFunction } from 'express'
import { ApplicationError } from './../../../util/error'

export function query(key: string, required: boolean, type: 'string' | 'int' | 'float' | 'boolean' | 'custom', transform?: (value: string) => any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (required && req.query[key] === undefined) {
        // 必要但是不存在
        throw new ApplicationError(`缺少必要的查詢選項 "${key}"`, 400)
      }

      if (req.query[key] === undefined) {
        // 非必要且不存在
        next()
        return
      }

      // 存在 => 進行處理
      let param = req.query[key]
      switch (type) {
        case 'int':
          try {
            req.query[key] = Number.parseInt(param)
          } catch (raw) {
            throw new ApplicationError(`搜尋值 "${key}" 為整數，但是轉換錯誤`, 400)
          }
          break
        case 'float':
          try {
            req.query[key] = Number.parseFloat(param)
          } catch (raw) {
            throw new ApplicationError(`搜尋值 "${key}" 為數字，但是轉換錯誤`, 400)
          }
          break
        case 'boolean':
          if (['true', 'false'].includes(param)) {
            req.query[key] = param == 'true'
          } else {
            throw new ApplicationError(`搜尋值 "${key}" 為布林值，必須為 "true" 或是 "false"`, 400)
          }
          break
        case 'custom':
          try {
            if (transform) {
              req.query[key] = transform(param)
            } else {
              throw new ApplicationError(`伺服器錯誤，搜尋值 "${key}" 沒有轉換函數`, 500)
            }
          } catch (raw) {
            throw new ApplicationError(`搜尋值 "${key}" 轉換錯誤`, 400, raw)
          }
          break
      }
    } catch (err) {
      next(err)
      return
    }

    next()
  }
}
