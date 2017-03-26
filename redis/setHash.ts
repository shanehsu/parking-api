var redis = require('redis')
var client = redis.createClient()

client.on("error", function (err: string | any) {
    console.log("Error: " + err)
})

/*1 if field is a new field in the hash and value was set.*/
/*0 if field already exists in the hash and the value was updated.*/
let _id: string = "testId: asdkjg"

client.hset("hashName", "key1", "value1", (error: any, reply: any) => {
    if (error) {
        console.log(error.json())
    } else if (reply == 1) {
        console.log("reply:" + reply)
        //client.publish("testChannel", _id)
    } else if (reply == 0) {
        console.log("reply:" + reply)
    } else {
        console.log("else: " + reply)
    }
})
// client.hkeys("key", function (err: string, replies: any) {
//     console.log(replies)
//     replies.forEach(function (reply: string, i: number) {
//         console.log("    " + i + ": " + reply);
//     });
//     client.quit();
// })