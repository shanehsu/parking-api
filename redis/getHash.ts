var redis = require('redis')
var client = redis.createClient()

client.on("error", function (err: string | any) {
    console.log("Error: " + err)
})

// client.hset("key", "ije", "true", redis.print)

// client.hkeys("key", function (err: string, replies: any) {
//     console.log(replies)
//     replies.forEach(function (reply: string, i: number) {
//         console.log("    " + i + ": " + reply);
//     });
//     client.quit();
// })

client.hget("hashName", "key1", redis.print)
