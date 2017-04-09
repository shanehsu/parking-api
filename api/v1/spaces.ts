import { Router } from 'express'
import { ApplicationError } from './../../util/error'
import { Grids, ConsecutiveGrids, Grid } from './util/grid'
import { query } from './util/query'
import { auth } from './util/auth'
import { createRandom } from './../../util/random'
export let spacesRouter = Router()

let http = require('http').createServer()
let server = http.createServer('http://localhost')
server.listen(9000)

let io = require('socket.io')
let serv_io = io.listen(server)

spacesRouter.get('/',
  auth(['users', 'admins']),
  query('all', false, 'boolean'),
  query('serial', false, 'boolean'),
  query('grids', true, 'custom', (value: string) => Grids.parse(value)),
  async (req, res, next) => {
    try {
      let grids: Grids = req.query.grids

      if (grids.grids.length > 100) {
        throw new ApplicationError(`要求超過 100 個方格。`, 400)
      }

      let gridsQuery = {
        "$or": grids.consecutiveGrids.map(consecutiveGrid => {
          //console.log(consecutiveGrid.latitude)
          //console.log(consecutiveGrid.latitudeGridSpan)
          //console.log(consecutiveGrid.latitude)
          return {
            "$and": [
              { "longitude": { "$gte": consecutiveGrid.longitude } },
              { "longitude": { "$lt": consecutiveGrid.longitude + consecutiveGrid.longitudeGridSpan * 0.01 } },
              { "latitude": { "$gte": consecutiveGrid.latitude } },
              { "latitude": { "$lt": consecutiveGrid.latitude + consecutiveGrid.latitudeGridSpan * 0.01 } }
            ]
          }
        })
      }

      console.log(JSON.stringify(gridsQuery))

      // TODO: Move this to query(), use the `default` setting
      let all: boolean = req.query.all === undefined ? false : req.query.all

      let allQuery = all === true ? {
        "available": { $exists: true }
      } : {
          "available": !all
        }

      // TODO: Move this to query(), use the `default` setting
      let serial: boolean = req.query.serial === undefined ? false : req.query.serial

      let result: any = null

      try {
        result = await req.db.collection('spaces').find({
          "$and": [gridsQuery, allQuery]
        }, {
            sensorId: 0
          }
          /*!serial ? { serial: 0, sensorId: 0 } : undefined*/
        ).toArray()
      } catch (err) {
        throw new ApplicationError('資料庫錯誤', 500, err)
      }

      res.json(result)
    } catch (err) {
      next(err)
    }
  })

spacesRouter.get('/subscribe', (req, res, next) => {
  let grids = Grids.parse(req.query.grids)
  let subscribe: string
  grids.grids.forEach(async (grid: Grid) => {
    let channel: string = grid.latitude.toString().substr(0, 5) + ":" + grid.longitude.toString().substr(0, 6)

    //let subscribed: boolean = await req.client.subscribe(channel, (data))
    req.client.subscribe(channel, setInterval((data: string) => {
      if (data) {
        let message: string[] = data.split(':', 3)
        let ioLatitude: string = message[0]
        let ioLongitude: string = message[1]
        let ioParked: string = message[2]
        let socketChannel: string = grid.toString()
        let result = {
          "latitude": ioLatitude,
          "longitude": ioLongitude,
          "parked": ioParked
        }

        serv_io.sockets.on('connection', function (socket: any) {
          socket.emit(channel, result)
        })
      }
    }), 100)//setInterval ->100 miliseconds
  })

})

spacesRouter.post('/random', auth('admins'), async (req, res, next) => {
  let count = Number.isNaN(+req.body.count) ? 100 : +req.body.count
  try {
    let result = await req.db.collection('spaces').remove({})
    result = await req.db.collection('sensors').remove({})
    result = await createRandom(req.db, count)
    res.json(result)
  } catch (err) {
    next(new ApplicationError('資料庫錯誤', 500, err))
  }
})
