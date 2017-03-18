// import { Router } from "express"

// var https = require('https')
// /*
// 確認身分
// GET https://graph.facebook.com/v2.8/oauth/access_token?
//    client_id={app-id}
//    &redirect_uri={redirect-uri}
//    &client_secret={app-secret}
//    &code={code-parameter}
// */

// /*
// 檢查存取權杖
// GET graph.facebook.com/debug_token?
//      input_token={token-to-inspect}
//      &access_token={app-token-or-admin-token}
// */

// let appId = '400713556954643'
// let secret = 'e23e1d6193fc2f872a738ee3ae5e6923'
// let access_token = '49078f6d17323880d74542292bcbef11'

// secretRouter.get('/secret', async function (req, res, next) {
//     let result = {
//         appId: appId,
//         secret: secret
//     }
//     res.json(result)
// })

// checkRouter.post('/checkToken', async function (req, res, next) {
//     let checkToken = req.body.input_token
//     let checkAccessToken = access_token
//     let result = null

//     //GET URL setting
//     let options = {
//         host: 'graph.facebook.com',
//         path: '/debug_token?' + checkToken + '&' + checkAccessToken
//     }

//     //check if response app_id == appId
//     let checkRes = https.get(options, function (res: any, err: any) {
//         console.dir(res)

//         if (res.app_id === appId) {
//             console.log('success')
//             result = 'success'
//         } else {
//             console.dir(err)
//             result = 'Error'
//         }

//     })
//     res.json(result).status(500)
// })