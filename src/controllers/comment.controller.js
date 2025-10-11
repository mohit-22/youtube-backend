import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const addComment = asyncHandler(async (req, res) => {
    // 1. Get content from the request body
    const { content } = req.body;

    // 2. Validate that content exists and is not empty
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content cannot be empty");
    }

    // 3. Get the videoId from the URL parameters
    const { videoId } = req.params;
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Optional but recommended: Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // 4. Create the comment in the database
    const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: req.user?._id, // Assumes verifyJWT middleware adds user to req
    });

    if (!comment) {
        throw new ApiError(500, "Failed to create the comment in the database");
    }

    // 5. Send a successful response
    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment created successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if(!commentId){
        throw new ApiError(400,"commentId not found for delete")
    }

    const comment = await Comment.findById(commentId)

    //  SECURITY CHECK: 
    if (comment.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Aap sirf apni hi comment delete kar sakte hain.");
    }

    try{
        await Comment.findByIdAndDelete(commentId)
    }catch{
        throw new ApiError(400,"unable to delete comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {} , "comment delete successfully")
    )
})

export { 
    addComment,
    deleteComment
 }
