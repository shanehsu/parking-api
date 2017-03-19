import * as express from "express"

import { checkFbRouter } from './fbRouter'
import body_parser = require('body-parser')

let app = express()
let port = 3000

app.use(body_parser.json())
app.use('/facebook', checkFbRouter)

app.listen(port, () => {
    console.log(`app監聽傳輸埠 ${port}`)
})