import { Router } from "express"
import { facebookRouter } from "./facebook"

export let socialRouter = Router()
socialRouter.use('/facebook', facebookRouter)
