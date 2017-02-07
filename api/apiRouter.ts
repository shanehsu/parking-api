import { Router } from 'express'
import { v1Router } from './v1/v1Router'

export let apiRouter = Router()
apiRouter.use('/v1', v1Router)
