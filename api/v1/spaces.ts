import { Router } from 'express'
import { ApplicationError } from './../../util/error'
import { Grids, ConsecutiveGrids, Grid } from './util/grid'
import { query } from './util/query'
import { auth } from './util/auth'
import { createRandom } from './../../util/random'

export let spacesRouter = Router()

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
          "available": all
        }
      allQuery = { "available": false }
      console.log(JSON.stringify(allQuery))
      // let available: boolean = req.query.available === undefined ? false : req.query.available
      // let availableQuery = {
      //   "available": available
      // }

      // TODO: Move this to query(), use the `default` setting
      let serial: boolean = req.query.serial === undefined ? false : req.query.serial

      let result: any = null

      try {
        result = await req.db.collection('spaces').find({
          "$and": [gridsQuery, allQuery]
        }, !serial ? { serial: 0 } : undefined).toArray()
      } catch (err) {
        throw new ApplicationError('資料庫錯誤', 500, err)
      }

      res.json(result)
    } catch (err) {
      next(err)
    }
  })

spacesRouter.post('/random', auth('admins'), async (req, res, next) => {
  let count = Number.isNaN(+req.body.count) ? 100 : +req.body.count
  try {
    let result = await createRandom(req.db, count)
    res.json(result)
  } catch (err) {
    next(new ApplicationError('資料庫錯誤', 500, err))
  }
})
