import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteTweet, editTweet, postTweet } from "../controllers/tweet.controller.js";

const router = Router()

router.route("/postTweet").post(
    verifyJWT,
    postTweet
)
router.route("/deleteTweet/:tweetId").delete(
    verifyJWT,
    deleteTweet
)

router.route("/updateTweet/:tweetId").patch(
    verifyJWT,
    editTweet
)


export default router