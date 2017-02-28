import { Router } from 'express'
import { ApplicationError } from './../../util/error'
import { Grids, ConsecutiveGrids, Grid } from './util/grid'
import { query } from './util/query'
import { createRandom } from './../../util/random'

export let spacesRouter = Router()

spacesRouter.get('/',
  query('available', false, 'boolean'),
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
          return {
            "longitude": {
              "$and": [{ "$gte": consecutiveGrid.longitude }, { "$lt": consecutiveGrid.longitude + consecutiveGrid.longitudeGridSpan * 0.1 }]
            },
            "latitude": {
              "$and": [{ "$gte": consecutiveGrid.latitude }, { "$lt": consecutiveGrid.latitude + consecutiveGrid.latitudeGridSpan * 0.1 }]
            }
          }
        })
      }

      // TODO: Move this to query(), use the `default` setting
      let available: boolean = req.query.available === undefined ? false : req.query.available
      let availableQuery = {
        "available": available
      }

      // TODO: Move this to query(), use the `default` setting
      let serial: boolean = req.query.serial === undefined ? false : req.query.serial

      let result: any = null

      try {
        result = await req.db.collection('spaces').find({
          "$and": [gridsQuery, availableQuery]
        }, !serial ? { serial: 0 } : undefined).toArray()
      } catch (err) {
        throw new ApplicationError('資料庫錯誤', 500, err)
      }

      res.json(result)
    } catch (err) {
      next(err)
    }
  })
