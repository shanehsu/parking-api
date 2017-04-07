import { Router } from 'express'
import { sensorUpdate } from './sensor'

export let sensorRouter = Router()
sensorRouter.use('/update', sensorUpdate)