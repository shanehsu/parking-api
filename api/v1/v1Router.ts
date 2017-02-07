import { Router } from 'express'
import { spacesRouter } from './spaces'

export let v1Router = Router()

v1Router.use('/spaces', spacesRouter)
