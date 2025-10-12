import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { tooglelikeComment, tooglelikeTweet, tooglelikeVideo } from "../controllers/like.controller.js";

const router = Router()

router.route("/video/:videoId").post(
    verifyJWT,
    tooglelikeVideo
)

router.route("/comment/:commentId").post(
    verifyJWT,
    tooglelikeComment
)

router.route("/tweet/:tweetId").post(
    verifyJWT,
    tooglelikeTweet
)

export default router