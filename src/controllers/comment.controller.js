// import { Comment } from "../models/comment.model.js";
// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { Video } from "../models/video.model.js";

// const addComment = asyncHandler(async(req,res) => {
//     const {content} = req.body
//     if(!content || content.trim() === ""){
//         throw new ApiError(400,"comment not found")
//     }

//     const { videoId } = req.params
//     if(!videoId){
//         throw new ApiError(400,"video not found during comment")
//     }

//     // Optional but recommended: Check if the video exists
//     const video = await Video.findById(videoId)
//     if(!video){
//         throw new ApiError(400,"video not found during comment")
//     }

//     const comment = await Comment.create({
//         content:comment_text,
//         video:videoId,
//         owner:req.user?._id,
//     })

//     if(!comment){
//         throw new ApiError(500,"comment is not created in db")
//     }

//     return res
//     .status(200)
//     .json(new ApiResponse(200,comment,"comment added successfully"))

// })

// export {addComment}



import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const addComment = asyncHandler(async (req, res) => {
    // 1. Get content from the request body
    // The original code was: const comment_text = req.body
    // This was incorrect because req.body is an object: { "content": "..." }
    // We need to destructure the 'content' property from the body.
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
    // The original code had incorrect syntax: .status.json(200, comment, "...")
    // The correct syntax is .status(code).json(payload)
    // Using 201 "Created" is more appropriate here.
    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment created successfully"));
});

export { addComment };
