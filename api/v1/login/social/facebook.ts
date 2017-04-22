import { Router } from "express"
import { ApplicationError } from '../../../../util/error'

import crypto = require('crypto')
import request = require("request-promise-native")
import qs = require('querystring')

export let facebookRouter = Router()

let appId = '400713556954643'
let secret = 'e23e1d6193fc2f872a738ee3ae5e6923'
let access_token = '49078f6d17323880d74542292bcbef11'

facebookRouter.post('/', async function (req, res, next) {
  let accessToken = req.body.accessToken
  let userId = req.body.userId

  let facebookResponse = null
  try {
    facebookResponse = await request.get(`https://graph.facebook.com/me`, {
      qs: {
        "appsecret_proof": crypto.createHmac('sha256', secret).update(accessToken).digest('hex'),
        "access_token": qs.escape(accessToken),
      }
    })
  } catch (err) {
    next(new ApplicationError("網路錯誤，無法向 Facebook 驗證您的要求。", 500, err))
    return
  }

  let returnedUserId = facebookResponse.body.me.id

  if (returnedUserId !== userId) {
    next(new ApplicationError("提供的臉書使用者 ID 以及 Token 不符合。", 401))
    return
  }

  // TODO: Check if this query is correct
  let result = null
  try {
    result = await req.db.collection('users').find(
      { "links": { type: "Facebook", userId: userId } }
    ).limit(1)
  } catch (err) {
    next(new ApplicationError("資料庫錯誤", 500, err))
    return
  }

  // TODO: Find a way to make this a === check
  if (result) {
    // TODO: Update access token if you have to
    res.status(200).json(result)
  } else {
    let document = {
      links: [
        { type: "Facebook", userId: userId, accessToken: accessToken }
      ]
    }
    try {
      let result = await req.db.collection('users').insert(document).then(result => {
        res.status(201).json(result)
      })
    } catch (err) {
      next(new ApplicationError("資料庫錯誤", 500, err))
      return
    }
  }
})
