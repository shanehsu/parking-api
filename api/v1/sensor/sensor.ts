import mongodb = require('mongodb')
import { Router } from "express"

import { Grids } from './../util/grid'

export let sensorUpdate = Router()

sensorUpdate.post('/', async function (req, res) {
  let sensor_id: string = req.body.id
  let space_id: string = ""
  let _parked: boolean = req.body.parked
  let latitude: string = ""
  let longitude: string = ""
  let filter = {
    "sensorId": new mongodb.ObjectID(sensor_id)
  }

  try {
    let result = await req.db.collection('spaces').findOneAndUpdate(
      filter,
      {
        $set: { available: _parked }
      },
      { maxTimeMS: 20000, /*returnNewDocument: true*/ }
    )

    console.dir(result)

    latitude = result.value.latitude.toString()
    longitude = result.value.longitude.toString()
    space_id = result.value._id.toString()

    res.json(result).status(200)
    console.log(result)
  } catch (err) {
    res.json(err)
    console.log(err)
  }

  //redis
  //let s = "12.04-15.03:12.07-12.08:120.33-120.55"
  //let grids = Grids.parse(s)
  //let all = grids.grids

  //console.dir(all)

  try {
    let grid: string = latitude.substr(0, 5) + ":" + longitude.substr(0, 6)
    let key: string = space_id //latitude + ":" + longitude

    let result = req.client.hget(grid, key, function (err: string | null, res: string) {
      // console.log("hget result: ")
      // console.log("res = ")
      // console.dir(res)
      // console.log("err = ")
      // console.dir(err)

      //let length = 0
      //if (res !== null) {
      //length = parseInt(res.charAt(1), 10)
      //}
      //let qParked: string = _parked.toString()
      //console.log("hget res length: " + length)

      if (res === null) {
        try {
          let sParked: string = _parked.toString()
          let client = req.client.hset(grid, key, sParked, function (err: string, res: string) {
            if (res) {
              let message: string = key + ":" + sParked
              req.client.publish(grid, message)
            } else if (err) {
              req.client.publish(grid, err)
              console.log("err1:" + err)
            } else {
              console.log("res1:" + res)
            }
          })
        } catch (err) {
          console.log("redis" + err)
          req.client.publish(grid, err)
        }
      } else if (res == "true" || res == "false") {
        console.log("res == true || false")

        let value: boolean = (res == 'true')
        if (value === _parked) {
          console.log("value is the same as usual..")
        } else if (value === !_parked) {
          console.log("value changed!")
          try {
            let sParked: string = _parked.toString()
            let message: string = key + ":" + sParked

            req.client.hset(grid, key, sParked, function (err: string, res: string) {
              if (res == '1' || res == '0') {
                console.log(`value changed and hset success, ready to publish to channel${grid}`)
                req.client.publish(grid, message)
                console.log("published message:" + message)
              } else {
                console.log("err: ")
                console.dir(err)
                console.log("res: ")
                console.dir(res)
              }
            })
          } catch (err) {
            req.client.publish(grid, err)
            console.log("publish published: " + err)
          }
        }
      } else {
        let sParked: string = _parked.toString()
        let client = req.client.hset(grid, key, sParked, function (err: string, res: string) {
          if (res) {
            let message: string = key + ":" + sParked
            req.client.publish(grid, message)
          } else if (err) {
            req.client.publish(grid, err)
            console.log(err)
          } else {
            req.client.publish(grid, err)
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
