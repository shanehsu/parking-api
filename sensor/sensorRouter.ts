import mongodb = require('mongodb')
import { Router } from "express"
//var redis = require('redis')

//let client = redis.createClient()

export let sensorUpdate = Router()

sensorUpdate.post('/sensorUpdate', async function (req, res) {
    let spaces_id: mongodb.ObjectID = req.body.id
    let _parked: boolean = req.body.parked

    let filter = {
        "id": spaces_id
    }

    // redis sub/pub
    /*
    _parked = true
    client.hset("parking-hash", "id", function (res: any, err: any) {
        if (res == 1) {
            let result = {
                "spaces_id": spaces_id,
                "parked": _parked
            }
            client.publish("parked-channel", result)
        } else if (err) {
            console.log(err)
        } else {
            console.log(res)
        }
    })
    spaces_id = req.body.id
    _parked = req.body.parked
    */
    //...test.

    try {
        let result = await req.db.collection('spaces').findOneAndUpdate(
            filter,
            {
                $set: { available: _parked }
            },
            { maxTimeMS: 20000, /*returnNewDocument: true*/ }
        ).then(result => {
            res.json(result).status(200)
            console.log(result)
        })
    } catch (err) {
        res.json(err)
        console.log(err)
    }


    //console.log(result)

})
