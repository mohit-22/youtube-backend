import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getCommentLike, getTweetLike, getvideoLike, tooglelikeComment, tooglelikeTweet, tooglelikeVideo } from "../controllers/like.controller.js";


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

router.route("/video/number_of_likes/:videoId").get(
    verifyJWT,
    getvideoLike
)

router.route("/tweet/number_of_likes/:tweetId").get(
    verifyJWT,
    getTweetLike
)

router.route("/comment/number_of_likes/:commentId").get(
    verifyJWT,
    getCommentLike
)


export default router