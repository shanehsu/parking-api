var redis = require("redis");
var sub = redis.createClient(), pub = redis.createClient();
var msg_count = 0;

// sub.on("subscribe", function (channel: string, count: number) {
//     pub.publish("a nice channel", "I am sending a message.");
//     pub.publish("a nice channel", "I am sending a second message.");
//     pub.publish("a nice channel", "I am sending my last message.");
// });

// interface sensor {
//     sensorId: string
//     parked: boolean
// }

sub.on("message", function (channel: string, message: string) {
    let result: string[] = message.split(" ")
    console.log("sub channel " + channel + ": " + message);
    console.log("result[0](field0): " + result[0])
    console.log("result[1](value0): " + result[1])
    console.log("result[2](field1): " + result[2])
    console.log("result[3](value1): " + result[3])

    msg_count += 1;
    if (msg_count === 3) {
        sub.unsubscribe();
        sub.quit();
        pub.quit();
    }
});

sub.subscribe("a nice channel");
