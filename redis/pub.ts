var redis = require("redis");
var sub = redis.createClient(), pub = redis.createClient();
var msg_count = 0;

// interface sensor {
//     sensorId: string
//     parked: boolean
// }

let message = "sensorId: test-redis, parked: true"

pub.publish("a nice channel", message);
// pub.publish("a nice channel", "I am sending a second message.");
// pub.publish("a nice channel", "I am sending my last message.");