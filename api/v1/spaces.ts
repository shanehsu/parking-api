import { Router } from 'express'
import { ApplicationError } from './../../util/error'
import { Grids, ConsecutiveGrids, Grid } from './util/grid'
import { createRandom } from './../../util/random'

export let spacesRouter = Router()

spacesRouter.get('/', (req, res, next) => {
  try {
    // 路徑需要 `grids` 查詢選項
    if (!req.query.grids) {
      throw new ApplicationError(`缺少必要的查詢選項 "grids"`, 400)
    }

    // 處理 blocks
    let grids = Grids.parse(req.query.grids)
    if (grids.grids.length > 100) {
      throw new ApplicationError(`要求超過 100 個方格。`, 400)
    }
    let query = {
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


    //Peter
    if (!req.query.available && !req.query.serial) {
      let result = req.db.collection('spaces').find(query, {}).toArray().then(
        result => res.json(result)
      )
      res.json(result)
    } else if (req.query.available && !req.query.serial) {
      let result = req.db.collection('spaces').find(query, [{ available: { "$eq": true } }, { serial: { "$eq": false } }]).toArray().then(
        result => res.json(result)
      )

    } else if (!req.query.avaible && req.query.serial) {
      let result = req.db.collection('spaces').find(query, [{ available: { "$eq": false } }, { serial: { "$eq": true } }]).toArray().then(
        result => res.json(result)
      )
      res.json(result)
    } else if (req.query.avaible && req.query.serial) {
      let result = req.db.collection('spaces').find(query, [{ available: { "$eq": true } }, { serial: { "$eq": true } }]).toArray().then(
        result => res.json(result)
      )
      res.json(result)
    } else {
      let result = "無符合資料"
      throw new ApplicationError(`無符合資料`, 400)
    }
    //PeterEnd

    //let result = req.db.collection('spaces').find(query, {}).toArray()
  } catch (err) {
    next(err)
  }
})
