import { Message } from "../models/messages.model.js";
import { AsyncHandler } from "../utilities/AsyncHandler.js";
import { ApiResponce } from "../utilities/ApiResponce.js";
import { ApiError } from "../utilities/ApiError.js";

const AddMessage = AsyncHandler( async(req,res)=>{
    const {message,type} = req.body;
    const userId = req.user._id;

    if(!message || !type){
        throw new ApiError(400,"message and type are required")
    }

    const newMessage = await Message.create({
        message,
        type,
        user: userId
    });

    if(!newMessage){
        throw new ApiError(500,"Failed to add message");
    }

    return res.status(201).json(new ApiResponce(201,newMessage,"Message added successfully"));
})

const GetMessages = AsyncHandler( async(req,res)=>{
    const userId = req.user._id;
    const messages = await Message.find({user: userId}).sort({createdAt:1});

    return res.status(200).json(new ApiResponce(200,messages,"Messages retrieved successfully"));
})

export {AddMessage, GetMessages}