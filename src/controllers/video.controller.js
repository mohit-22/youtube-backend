import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { v2 as cloudinary } from 'cloudinary'; 

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
        await cloudinary.uploader.destroy(videofileUpload.public_id,{ resource_type: "video" });
        throw new ApiError(500, "Thumbnail Cloudinary pe upload nahi ho payi. (Thumbnail Upload Failed)");
    }
    
    

    const {title,description} = req.body
    if(!title){
        throw new ApiError(400,"videotitle is required")
    }

    const video = await Video.create({
        videoFile: videofileUpload.url,
        thumbnail: thumbnailUpload.url,
        videoFilePublicId: videofileUpload.public_id,
        thumbnailPublicId: thumbnailUpload.public_id,
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

const deleteVideo = asyncHandler(async(req,res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400,"videoId not found")
    }

    const video =  await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"video file not found")
    }

    //  SECURITY CHECK: 
    if (video.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Aap sirf apni hi videos delete kar sakte hain.");
    }

    // const videofile = video.videoFile
    // const thumbnail = video.thumbnail

    // function getPublicIdFromUrl(url) {
    //     const parts = url.split('/');
    //     const lastPart = parts[parts.length - 1]; // cvtliygyzjyo1zdqmn7u.jpg
    //     return lastPart.split('.')[0]; // cvtliygyzjyo1zdqmn7u
    // }

    // const videofile_id = getPublicIdFromUrl(videofile)
    // const thumbnail_id = getPublicIdFromUrl(thumbnail)

    const videofile_id = video.videoFilePublicId
    const thumbnail_id = video.thumbnailPublicId

    // try{
    //     await cloudinary.uploader.destroy(videofile_id,{ resource_type: "video" });
    // }catch{
    //     throw new ApiError(400,"faild to delete video file")
    // }
    // try{
    //     await cloudinary.uploader.destroy(thumbnail_id,{ resource_type: "image" });
    // }catch{
    //     throw new ApiError(400,"faild to delete thumbnail file")
    // }


         // --- Cloudinary Deletion ---
        try {
            // Video file delete
        await cloudinary.uploader.destroy(videofile_id, { resource_type: "video" });
            
            // Thumbnail file delete
         await cloudinary.uploader.destroy(thumbnail_id, { resource_type: "image" });

        } catch (error) {
            // Cloudinary API failure server side error hai, isliye 500 throw karo
            console.error("Cloudinary Deletion Error:", error);
            throw new ApiError(500, "Cloud service se files delete karne mein fail hua.");
        }


    try{
        await Video.findByIdAndDelete(videoId);
    }catch{
        throw new ApiError(500, "Database se video delete nahi ho payi.");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{} , "Video successfully delete ho gayi (DB aur Cloud dono se)."))



})

const updateVideoDetails = asyncHandler(async(req,res) => {
    const {title,description} = req.body

    if(!title && !description){
        throw new ApiError(400,"for update -> title or description atleast one field is required")
    }

    const {videoId} = req.params

    const video =  await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"video file not found")
    }

    //  SECURITY CHECK: 
    if (video.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Aap sirf apni hi videos update kar sakte hain.");
    }

    const updateVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title,
                description
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200,updateVideo,"video updated successfully"))

})

const updatethumbnail = asyncHandler(async(req,res) => {
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,"videoId not found")
    }

    const video =  await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"video  not found")
    }

    if (video.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Aap sirf apni hi videos update kar sakte hain.");
    }

    const thumbnail_id = video.thumbnailPublicId

    const new_thumbnail = req.file?.path
    if (!new_thumbnail) {
        throw new ApiError(400, " new_thumbnail file is missing")
    }

    try {
    // Thumbnail file delete
        await cloudinary.uploader.destroy(thumbnail_id, { resource_type: "image" });

    } catch (error) {
        // Cloudinary API failure server side error hai, isliye 500 throw karo
        console.error("Cloudinary Deletion Error:", error);
        throw new ApiError(500, "Cloud service se files delete karne mein fail hua.");
    }

    const thumbnail_toupload  = await uploadOnCloudinary(new_thumbnail)
    if(!thumbnail_toupload){
        throw new ApiError(400,"thumbnail_toupload  not found")
    }


    const updatedvideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                thumbnail: thumbnail_toupload.url 
            }
        },
        {new: true}
    )
    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedvideo,"video thubnail upload successfully")
    )


})




export {
    uploadVideo,
    deleteVideo,
    updateVideoDetails,
    updatethumbnail
}