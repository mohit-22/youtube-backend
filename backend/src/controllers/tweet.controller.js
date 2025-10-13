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

const deleteTweet = asyncHandler(async(req,res) => {
    const { tweetId } = req.params
    if(!tweetId ){
            throw new ApiError(400," tweetId not found for delete")
    }
    const tweet = await Tweet.findById(tweetId)
    if(!tweet ){
            throw new ApiError(400," tweet not found for delete")
    }

    
    //  SECURITY CHECK: 
    if (tweet.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Aap sirf apni hi tweet delete kar sakte hain.");
    }

    try{
        await Tweet.findByIdAndDelete(tweetId)
    }catch{
        throw new ApiError(403,"tweet not delete successfully")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200,{},"tweet delete successfully" )
    )
})

const editTweet = asyncHandler(async(req,res) => {
    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400,"tweetId not found for delete")
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(400,"tweet not found for delete")
    }

    if (tweet.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Aap sirf apni hi tweet update kar sakte hain.");
    }

    const { content } = req.body
    if(!content){
        throw new ApiError(400,"newComment not found ")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                content,
            }
        },
        {new: true}

    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedTweet,"tweet updatd successfully")
    )


})


export {
    postTweet,
    deleteTweet,
    editTweet
}