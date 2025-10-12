import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";

const tooglelikeTweet = asyncHandler(async(req,res) => {
    const {tweetId} = req.params

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweetId format.");
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"Tweet not found")
    }
    

    const user = req.user?._id

    const likeCondition = {
        tweet:tweetId,
        likedBy: user
    }

    const existingLike = await Like.findOne(likeCondition)

    let isLiked
    let operation
    if(!existingLike){
        const Likecreate = await Like.create(likeCondition)
        if(!Likecreate){
            throw new ApiError(400,"like nhi hua")
        }
        isLiked=true
        operation="like successfull"
    }
    else{
        const likeDelete = await Like.findByIdAndDelete(existingLike._id)
        if(!likeDelete){
            throw new ApiError(400,"unlike nhi hua")
        }
        isLiked=false
        operation="unlike successfull"
    }

    return res.status(200)
    .json(new ApiResponse(200,{isLiked,tweetId},operation))

})

const tooglelikeVideo = asyncHandler(async(req,res) => {
    const {videoId} = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid videoId format.");
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    

    const user = req.user?._id

    const likeCondition = {
        video:videoId,
        likedBy: user
    }

    const existingLike = await Like.findOne(likeCondition)

    let isLiked
    let operation
    if(!existingLike){
        const Likecreate = await Like.create(likeCondition)
        if(!Likecreate){
            throw new ApiError(400,"like nhi hua")
        }
        isLiked=true
        operation="like successfull"
    }
    else{
        const likeDelete = await Like.findByIdAndDelete(existingLike._id)
        if(!likeDelete){
            throw new ApiError(400,"unlike nhi hua")
        }
        isLiked=false
        operation="unlike successfull"
    }

    return res.status(200)
    .json(new ApiResponse(200,{isLiked,videoId},operation))

})

const tooglelikeComment = asyncHandler(async(req,res) => {

    const {commentId} = req.params

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid commentId format.");
    }

    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,"Comment not found")
    }
    

    const user = req.user?._id

    const likeCondition = {
        comment:commentId,
        likedBy: user
    }

    const existingLike = await Like.findOne(likeCondition)

    let isLiked
    let operation
    if(!existingLike){
        const Likecreate =  await Like.create(likeCondition)
        if(!Likecreate){
            throw new ApiError(400,"like nhi hua")
        }
        isLiked=true
        operation="like successfull"
    }
    else{
        const likeDelete = await Like.findByIdAndDelete(existingLike._id)
        if(!likeDelete){
            throw new ApiError(400,"unlike nhi hua")
        }
        isLiked=false
        operation="unlike successfull"
    }

    return res.status(200)
    .json(new ApiResponse(200,{isLiked,commentId},operation))

})

const getvideoLike = asyncHandler(async(req,res) => {
    const { videoId } = req.params
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid videoId format.");
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }

    const getlike = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as:"likesDetails",
                pipeline: [
                    {
                        $project: {
                            //  IMPORTANT: Hum sirf likedBy user ki ID nikal rahe hain
                            _id: 0, 
                            likedBy: "$likedBy" 
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                no_ofLikesCount: {
                    $size: "$likesDetails"
                }
            }
        },
        {
            $project: {
                no_ofLikesCount: 1,
                tweetOwner: "$owner", 
                likedByUsers: "$likesDetails.likedBy", 
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, getlike[0], "getvideoLike fetched successfully")
    )
})

// const getTweetLike = asyncHandler(async(req,res) => {
//     const { tweetId } = req.params
//     if (!mongoose.Types.ObjectId.isValid(tweetId)) {
//         throw new ApiError(400, "Invalid tweetId format.");
//     }

//     const tweet = await Tweet.findById(tweetId)
//     if(!tweet){
//         throw new ApiError(404,"tweet not found")
//     }

//     const getlike = await Tweet.aggregate([
//         {
//             $match: {
//                 _id: new mongoose.Types.ObjectId(tweetId)
//             }
//         },
//         {
//             $lookup: {
//                 from: "likes",
//                 localField: "_id",
//                 foreignField: "tweet",
//                 as:"likesDetails",
//                
//             }
//         },
//         {
//             $addFields: {
//                 no_ofLikesCount: {
//                     $size: "$likesDetails"
//                 }
//             }
//         },
//         {
//             $project: {
//                 no_ofLikesCount: 1,
//                 tweetOwner: "$owner", 
//                 likedByUsers: "$likesDetails", 
//             }
//         }
//     ])

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200, getlike[0], "getTweetLike fetched successfully")
//     )
// })

const getTweetLike = asyncHandler(async(req,res) => {
    const { tweetId } = req.params
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweetId format.");
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"tweet not found")
    }

    const getlike = await Tweet.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(tweetId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as:"likesDetails",
                pipeline: [
                    {
                        $project: {
                            //  IMPORTANT: Hum sirf likedBy user ki ID nikal rahe hain
                            _id: 0, 
                            likedBy: "$likedBy" 
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                no_ofLikesCount: {
                    $size: "$likesDetails"
                }
            }
        },
        {
            $project: {
                no_ofLikesCount: 1,
                tweetOwner: "$owner", 
                likedByUsers: "$likesDetails.likedBy", 
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, getlike[0], "getTweetLike fetched successfully")
    )
})

const getCommentLike = asyncHandler(async(req,res) => {
    const { commentId } = req.params
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid commentId format.");
    }

    const comment = await Tweet.findById(commentId)
    if(!comment){
        throw new ApiError(404,"comment not found")
    }

    const getlike = await Comment.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(commentId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as:"likesDetails",
                pipeline: [
                    {
                        $project: {
                            //  IMPORTANT: Hum sirf likedBy user ki ID nikal rahe hain
                            _id: 0, 
                            likedBy: "$likedBy" 
                        }
                    }
                ]
            }

        },
        {
            $addFields: {
                no_ofLikesCount: {
                    $size: "$likesDetails"
                }
            }
        },
        {
            $project: {
                no_ofLikesCount: 1,
                tweetOwner: "$owner", 
                likedByUsers: "$likesDetails.likedBy", 
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, getlike[0], "getCommentLike fetched successfully")
    )
})

export {
    tooglelikeComment,
    tooglelikeTweet,
    tooglelikeVideo,
    getvideoLike,
    getTweetLike,
    getCommentLike
}