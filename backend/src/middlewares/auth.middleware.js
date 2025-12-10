import { AsyncHandler } from "../utilities/AsyncHandler.js"
import { ApiError } from "../utilities/ApiError.js"
import { User } from "../models/user.model.js"
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config()

export const UserVerify = AsyncHandler( async(req,res,next)=>{
    try{
        console.log("[*] token: ",req.cookies);
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","")
        console.log(token);
        console.log("cannot get the access token");
        console.log(" ////////////////////////////////////////");
        console.log("header = ",JSON.stringify(req.headers));
        console.log("=========================================");
        
        
        
        if(!token){
            throw new ApiError(404,"unAuthorized req")
        }
        
        const decodedtoken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedtoken?.id).select("-password -refreshtoken")
        
        if (!user){
            throw new ApiError(401,"invalid accesstoken")
        }

        req.user = user
        next()
    }
    catch(error){
        throw new ApiError(401,error?.message || "invalid accesstoken 1")
    }
})

