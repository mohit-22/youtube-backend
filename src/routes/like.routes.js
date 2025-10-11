import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { likeComment, likeTweet, likeVideo } from "../controllers/like.controller.js";

const router = Router()

router.route("/video/:videoId").post(
    verifyJWT,
    likeVideo
)

router.route("/comment/:commentId").post(
    verifyJWT,
    likeComment
)

router.route("/tweet/:tweetId").post(
    verifyJWT,
    likeTweet
)

export default router