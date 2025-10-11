import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const postTweet = asyncHandler(async(req,res) => {
    const {content} = req.body
    if(!content || content.trim() === ""){
            throw new ApiError(400,"content of tweet not found")
    }

    const tweet = await Tweet.create({
        content: content,
        owner: req.user?._id
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201,tweet,"tweet publish successfully")
    )


})



export {
    postTweet,
}