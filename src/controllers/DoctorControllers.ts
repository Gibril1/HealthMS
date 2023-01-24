import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const asyncHandler = require('express-async-handler')
import { Response } from 'express'
import { IGetUserAuthInfoRequest } from '../interfaces/AuthInterfaces'


const acceptOrDeclineMeetings = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {

})
const getInvitedMeetings = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {

})
const getAcceptedMeetings = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {

})
const getDeclinedMeetings = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {

})


module.exports = {
    acceptOrDeclineMeetings,
    getInvitedMeetings,
    getAcceptedMeetings,
    getDeclinedMeetings
}