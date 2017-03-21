import mongodb = require('mongodb')
import { Router } from "express"

export let sensorUpdate = Router()

sensorUpdate.post('/sensorUpdate', async function (req, res) {
    let spaces_id: String = req.body.id
    let _parked: boolean = req.body.parked

    let filter = {
        "id": spaces_id
    }

    try {
        let result = await req.db.collection('spaces').findOneAndUpdate(
            filter,
            {
                $set: { parked: _parked }
            },
            { maxTimeMS: 2000 }
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