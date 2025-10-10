import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";


const uploadVideo = asyncHandler(async (req, res) => {
	const videoFileLocalPath  = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path; // thumbnail key


    // if(!videoFileLocalPath  || !thumbnailLocalPath){
    //     throw new ApiError(400,"videoFile and thumbmail both are required")
    // }

    if (!videoFileLocalPath) {
        // Agar Thumbnail local path available hai, toh use delete karo
        if (thumbnailLocalPath) {
            fs.unlinkSync(thumbnailLocalPath);
        }
        throw new ApiError(400, "Video file upload karna zaruri hai.");
    }
    
    // Case 2: Agar Thumbnail file missing hai
    if (!thumbnailLocalPath) {
        // Video file local path available hai, toh use delete karo
        if (videoFileLocalPath) {
            fs.unlinkSync(videoFileLocalPath);
        }
        throw new ApiError(400, "Thumbnail file upload karna zaruri hai.");
    }
    

    // const videofileUpload = await uploadOnCloudinary(videoFileLocalPath)
    // const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath)

    // if(!videofileUpload || !thumbnailUpload){
    //     throw new ApiError(400,"faild to upload videoFile or thumbmail on cloudinary")
    // }


    const videofileUpload = await uploadOnCloudinary(videoFileLocalPath); 

    if (!videofileUpload) {
        // Agar yahi fail ho gaya toh thumbnail upload karna hi nahi hai.
        throw new ApiError(500, "Video Cloudinary pe upload nahi ho payi. (Video Upload Failed)");
    }
    
    // 2. Thumbnail upload (only if video is successful)
    const thumbnailUpload =  await uploadOnCloudinary(thumbnailLocalPath); 

    if (!thumbnailUpload) {
        // 2a. Thumbnail fail hui, toh abhi-abhi upload hui video file ko delete karo (Cloudinary se)
        await deleteOnCloudinary(videofileUpload.public_id, "video");
        throw new ApiError(500, "Thumbnail Cloudinary pe upload nahi ho payi. (Thumbnail Upload Failed)");
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