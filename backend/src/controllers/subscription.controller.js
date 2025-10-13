import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const subscribeToChannel = asyncHandler(async(req,res) => {
    const {channelId} = req.params
    if(!mongoose.Types.ObjectId.isValid(channelId)){
        throw new ApiError(400,"invalid channel Id to suscribe")
    }
    const user = await User.findById(channelId)
    if(!user){
        throw new ApiError(400,"user not found to suscribe")
    }

    if(channelId.toString()===req.user?._id.toString()){
        throw new ApiError(400,"user cannot suscribe yourself")
    }

    const suscribeCondition = {
        subscriber: req.user?._id,
        channel: channelId
    }

    const existingSuscriber = await Subscription.findOne(suscribeCondition)

    let isSubscribe
    let operation
    if(!existingSuscriber){
        const suscribe =  await Subscription.create(suscribeCondition)
        if(!suscribe){
            throw new ApiError(400,"suscribe Failed")
        }
        isSubscribe=true
        operation="suscribe successfull"
    }else{
       const unsuscribe =   await Subscription.findByIdAndDelete(existingSuscriber._id)
       if(!unsuscribe){
        throw new ApiError(400, "unsuscribe failed")
       }
       isSubscribe=false
       operation="unsuscribe successfull"
    }

    return res.status(200)
    .json(new ApiResponse(200,{isSubscribe,channelId},operation))


})

export{
    subscribeToChannel
}