import { Router } from "express"
import request = require("request-promise-native")
import qs = require('querystring')
import crypto = require('crypto')

export let router = Router()

let appId = '400713556954643'
let secret = 'e23e1d6193fc2f872a738ee3ae5e6923'
let access_token = '49078f6d17323880d74542292bcbef11'

router.get('/secret', async function (req, res, next) {
    let result = {
        appId: appId
    }
    res.json(result)
})

router.post('/checkToken', async function (req, res, next) {
    let checkToken = req.body.input_token

    request.get(`https://graph.facebook.com/me`, {
        qs: {
            "appsecret_proof": crypto.createHmac('sha256', secret).update(checkToken).digest('hex'),
            "access_token": qs.escape(checkToken)
        }
    }).then(data => {
        res.json(data).status(200)
    }).catch(err => {
        res.json(err).status(500)
    })

})
