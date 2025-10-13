import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, uploadVideo,updateVideoDetails,updatethumbnail } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/uploadVideo").post(verifyJWT,
    upload.fields([
        {
            name:"videoFile",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    uploadVideo
)

router.route("/delete/:videoId").delete(verifyJWT,deleteVideo)

router.route("/update/:videoId").patch(verifyJWT,updateVideoDetails)

router.route("/update_thumbnail/:videoId").patch(verifyJWT,
    upload.single("thumbnail"),
    updatethumbnail
)

export default router