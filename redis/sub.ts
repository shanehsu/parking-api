var redis = require("redis");
var sub = redis.createClient(), pub = redis.createClient();
var msg_count = 0;

let channel_name: string = "ch1"
// sub.on("subscribe", function (channel: string, count: number) {
//     pub.publish("a nice channel", "I am sending a message.");
//     pub.publish("a nice channel", "I am sending a second message.");
//     pub.publish("a nice channel", "I am sending my last message.");
// });

sub.on("message", function (channel: string, message: string) {
    console.log("sub channel " + channel + ": " + message);
    msg_count += 1;
    if (msg_count === 3) {
        sub.unsubscribe();
        sub.quit();
        pub.quit();
    }
});

sub.subscribe(channel_name);
