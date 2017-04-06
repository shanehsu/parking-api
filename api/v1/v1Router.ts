import { Router } from 'express'

import { spacesRouter } from './spaces'
import { loginRouter } from './login/loginRouter'
import { sensorRouter } from './sensor/sensorRouter'
export let v1Router = Router()

v1Router.use('/spaces', spacesRouter)
v1Router.use('/login', loginRouter)
v1Router.use('/sensor', sensorRouter)
