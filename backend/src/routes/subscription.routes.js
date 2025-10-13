
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { subscribeToChannel } from "../controllers/subscription.controller.js";

const router = Router()

router.route("/:channelId").post(
    verifyJWT,
    subscribeToChannel
)

export default router