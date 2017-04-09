import mongodb = require('mongodb')
import { Router } from "express"

import { Grids } from './../util/grid'

export let sensorUpdate = Router()

sensorUpdate.post('/', async function (req, res) {
    let spaces_id: mongodb.ObjectID = req.body.id
    let _parked: boolean = req.body.parked
    let latitude: string = ""
    let longitude: string = ""
    let filter = {
        "id": spaces_id
    }

    try {
        let result = await req.db.collection('spaces').findOneAndUpdate(
            filter,
            {
                $set: { available: _parked }
            },
            { maxTimeMS: 20000, /*returnNewDocument: true*/ }
        ).then(result => {
            latitude = result.value.latitude
            longitude = result.value.longitude

            res.json(result).status(200)
            console.log(result)
        })
    } catch (err) {
        res.json(err)
        console.log(err)
    }

    //redis
    let s = "12.04-15.03:12.07-12.08:120.33-120.55"
    let grids = Grids.parse(s)
    let all = grids.grids

    console.dir(all)

    try {
        let grid: string = latitude.substr(0, 5) + ":" + longitude.substr(0, 6)
        let key: string = latitude + ":" + longitude

        let result = req.client.hget(grid, key, async function (res: string, err: string) {
            let length: number = parseInt(res.charAt(1), 10)    //length should be 4(true) or 5(false)
            let qParked: string = _parked.toString()
            console.log("hget res length: " + length)
            if (length == 4 || length == 5) {
                let value: boolean = (res.substr(5, length) == 'true')
                if (value === _parked) {

                } else if (value === !_parked) {
                    try {
                        let sParked: string = _parked.toString()
                        let message: string = key + ":" + sParked

                        req.client.hset(grid, key, sParked, function (res: string, err: string) {
                            if (err) {
                                console.log("hset Error:" + err)
                            }
                        })
                        req.client.publish("grid", message)
                    } catch (err) {
                        console.log("publish error: " + err)
                    }
                }
            } else {
                let sParked: string = _parked.toString()
                let client = req.client.hset(grid, key, sParked, function (res: string, err: string) {
                    if (res) {
                        let message: string = key + ":" + sParked
                        req.client.publish(grid, message)
                    } else if (err) {
                        console.log(err)
                    } else {
                        console.log(res)
                    }
                })
                console.log("Unexpected: " + res)
            }
        })
    } catch (err) {
        console.log("hash error: " + err)
    }
    //console.log(result)

})

// TODO: Move Redis Connection to a middleware
// TODO: Link this API to v1Router
