import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const asyncHandler = require('express-async-handler')
import { Response } from 'express'
import { IGetUserAuthInfoRequest } from '../interfaces/AuthInterfaces'


const createMeeting = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {
    
})
const updateMeeting = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {

})
const deleteMeeting = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {

})
const getMeetings = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {

})
const getMeeting = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {

})

module.exports = {
    createMeeting,
    updateMeeting,
    deleteMeeting,
    getMeetings,
    getMeeting
}
