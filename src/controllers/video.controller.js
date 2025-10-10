import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";


const uploadVideo = asyncHandler(async (req, res) => {
	const videoFileLocalPath  = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path; // thumbnail key


    if(!videoFileLocalPath  || !thumbnailLocalPath){
        throw new ApiError(400,"videoFile and thumbmail both are required")
    }

    const videofileUpload = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath)

    if(!videofileUpload || !thumbnailUpload){
        throw new ApiError(400,"faild to upload videoFile or thumbmail on cloudinary")
    }

    const {title,description} = req.body
    if(!title){
        throw new ApiError(400,"videotitle is required")
    }

    const video = await Video.create({
        videoFile: videofileUpload.url,
        thumbnail: thumbnailUpload.url,
        title,
        description,
        duration: videofileUpload.duration || 0,
        isPublished:true,
        owner:req.user._id
    })

    if(!video){
        throw new ApiError(500,"Something went wrong while uploading the video")
    }
    // else{
    //     isPublished = 1
    // }

    return res.status(201).json(
        new ApiResponse(200,video,"video uploaded successfully")
    )
})

export {
    uploadVideo,
}