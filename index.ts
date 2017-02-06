import express = require('express')
import body_parser = require('body-parser')

let app = express()
app.use(body_parser.json())

app.set('port', (process.env.PORT || 5000))
app.use('/app', express.static(__dirname + '/app'))
app.use('/admin', express.static(__dirname + '/admin'))

app.get('/', (req, res) => {
  res.send("Hello World!")
})

app.listen(app.get('port'), () => {
  console.log(`Node app is running on port ${app.get('port')}`)
})
