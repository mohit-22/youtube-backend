

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment,deleteComment, editComment } from "../controllers/comment.controller.js";

const router = Router()

router.route("/addComment/:videoId").post(
    verifyJWT,
    addComment
)

router.route("/deleteComment/:commentId").delete(
    verifyJWT,
    deleteComment
)

router.route("/updateComment/:commentId").patch(
    verifyJWT,
    editComment
)

export default router