var redis = require('redis')
var client = redis.createClient()

client.on("error", function (err: string | any) {
    console.log("Error: " + err)
})

client.hgetall("hashName", (error: any, res: string) => {
    console.log(res)
})
