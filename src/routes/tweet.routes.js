import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteTweet, postTweet } from "../controllers/tweet.controller.js";

const router = Router()

router.route("/postTweet").post(
    verifyJWT,
    postTweet
)
router.route("/deleteTweet/:tweetId").delete(
    verifyJWT,
    deleteTweet
)

export default router