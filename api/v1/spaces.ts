import { Router } from 'express'
import { ApplicationError } from './../../util/error'
import { Grids, ConsecutiveGrids, Grid } from './util/grid'

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
            "$and": [{ "$ge": consecutiveGrid.longitude }, { "$lt": consecutiveGrid.longitude + consecutiveGrid.longitudeGridSpan * 0.1 }]
          },
          "latitude": {
            "$and": [{ "$ge": consecutiveGrid.latitude }, { "$lt": consecutiveGrid.latitude + consecutiveGrid.latitudeGridSpan * 0.1 }]
          }
        }
      })
    }
    let result = req.db.collection('spaces').find(query, {}).toArray()
  } catch (err) {
    next(err)
  }
})
