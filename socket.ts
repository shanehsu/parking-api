import { Grids, ConsecutiveGrids, Grid } from './api/v1/util/grid'
import socket_io = require('socket.io')
import node_redis = require('redis')

let server = require('http').createServer().listen(9000)
let io = socket_io.listen(server)
let redis: node_redis.RedisClient = node_redis.createClient(32770)

redis.on('message', function (channel: string, message: string) {
    if (message) {
        let ioMessage: string[] = message.split(':', 2)
        let key: string = ioMessage[0]
        let ioParked: string = ioMessage[1]
        let socketRoom: string = channel
        let result = {
            "id": key,
            "parked": ioParked
        }
        io.in(socketRoom).emit('change', result)
    } else {
        console.log("Unexpected: " + message)
    }
})

io.on('connection', socket => {
    socket.on('subscribe', (data: string) => {
        socket.join(data, function () {
            console.log("socket room:")
            console.dir(socket.rooms)
        })
        if (data) {
            redis.subscribe(data)
        }
    })
    socket.on('leave', (room: string) => {
        socket.leave(room, function () {
            console.log("socket left room: ")
            console.dir(socket.rooms)
        })
    })
})

