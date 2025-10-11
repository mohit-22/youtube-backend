import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const likeTweet = asyncHandler(async(req,res) => {
    const {tweetId} = req.params
    if(!tweetId ){
            throw new ApiError(400," tweetId not found for like")
    }
    const liketweet = await Like.create({
        tweet:tweetId,
        likedBy: req.user?._id
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201,liketweet,"tweet like  successfully")
    )

})

const likeVideo = asyncHandler(async(req,res) => {
    const {videoId} = req.params
    if(!videoId ){
            throw new ApiError(400," VideoId not found for like")
    }


    const likevideo = await Like.create({
        video:videoId,
        likedBy: req.user?._id
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201,likevideo,"video like  successfully")
    )

})

const likeComment = asyncHandler(async(req,res) => {
    const {commentId} = req.params
    if(!commentId ){
            throw new ApiError(400," commentId not found for like")
    }

    const likeComment = await Like.create({
        comment:commentId,
        likedBy: req.user?._id
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201,likeComment,"comment like  successfully")
    )

})

export {
    likeComment,
    likeTweet,
    likeVideo
}