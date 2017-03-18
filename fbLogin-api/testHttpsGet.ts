// var https = require('https')


// let checkToken = ''
// let checkAccessToken = '49078f6d17323880d74542292bcbef11'
// let appId = '400713556954643'

// let options = {
//     host: 'graph.facebook.com',
//     path: '/debug_token?' + checkToken + '&' + checkAccessToken
// }

// //check if response app_id == appId
// let checkRes = https.get(options, function (res, err) {
//     console.dir(res)

//     if (res.app_id == appId) {
//         console.log('success')
//     } else {
//         console.dir(err)
//     }
// })