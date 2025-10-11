import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { postTweet } from "../controllers/tweet.controller.js";

const router = Router()

router.route("/postTweet").post(
    verifyJWT,
    postTweet
)

export default router