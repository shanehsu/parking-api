import { Router } from "express"
import { socialRouter } from "./social/socialRouter"

export let loginRouter = Router()
socialRouter.use('/social', socialRouter)
