import { Router } from "express"
import request = require("request-promise-native")
import qs = require('querystring')
import crypto = require('crypto')
import { ApplicationError } from '../util/error'
import MongoDb = require('mongodb')
export let checkFbRouter = Router()

let appId = '400713556954643'
let secret = 'e23e1d6193fc2f872a738ee3ae5e6923'
let access_token = '49078f6d17323880d74542292bcbef11'

/*
router.get('/secret', async function (req, res, next) {
    let result = {
        appId: appId
    }
    res.json(result)
})
*/

checkFbRouter.post('/checkToken', async function (req, res, next) {
    let checkToken = req.body.input_token

    request.get(`https://graph.facebook.com/me`, {
        qs: {
            "appsecret_proof": crypto.createHmac('sha256', secret).update(checkToken).digest('hex'),
            "access_token": qs.escape(checkToken),
        }
    }).then(data => {
        let fbId = data.me.id
        res.json(data).status(200)
        let db: MongoDb.Db = req.db

        let result = req.db.collection('fbUser').find(
            { "accessToken": { $eq: checkToken } }, {}
        )
        if (result) { } else {
            db.collection('fbUser').insert({ "access_token": checkToken, "fb_Id": fbId })
        }
    }).catch(err => {
        res.json(err).status(500)
    })

})
