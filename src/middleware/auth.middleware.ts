import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asynchandler";
import { PrismaClient } from "@prisma/client";
import { IUserModel } from "../interfaces/auth.interfaces";

const prisma = new PrismaClient();

export const protect = asyncHandler(async(req:Request, res:Response, next:NextFunction) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            // get token
            token = req.headers.authorization.split(' ')[1]

            // verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

            // GET user from the token
            req.user = await prisma.user.findUnique({
                where:{
                    id: (decoded as jwt.JwtPayload).id as string
                },
                 
            }) as IUserModel
            next()
        } catch(err) {
            console.log(err)
            res.status(401)
            throw new Error('Not authorized')
        }
    }

    if(!token){
        res.status(401)
        throw new Error('Not authorized. No token')
    }
})
