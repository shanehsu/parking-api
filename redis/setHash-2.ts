var redis = require('redis')
var client = redis.createClient()

client.on("error", function (err: string | any) {
    console.log("Error: " + err)
})

client.hset("hashName", "key", "value:false", redis.print)
