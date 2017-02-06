import express = require('express')
import body_parser = require('body-parser')
import mongodb = require('mongodb')

let app = express()
app.use(body_parser.json())

app.set('port', (process.env.PORT || 5000))
app.use('/app', express.static(__dirname + '/app'))
app.use('/admin', express.static(__dirname + '/admin'))

app.get('/', async (req, res) => {
  // 試圖連線至 MongoDB
  let uri = process.env.MONGODB_URI
  let client = new mongodb.MongoClient()
  try {
    let connection = await client.connect(uri)
    res.send("Hello World!")
    connection.close()
  } catch (err) {
    res.json({
      "message": "資料庫連線失敗",
      "raw": err
    })
  }
})

app.listen(app.get('port'), () => {
  console.log(`Node app is running on port ${app.get('port')}`)
})
