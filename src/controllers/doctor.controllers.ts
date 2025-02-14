import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import asyncHandler from '../utils/asynchandler'
import { Response, Request } from 'express'
import { IAcceptMeetingInterface } from '../interfaces/body.interfaces'





export const acceptOrDeclineMeetings = asyncHandler(async(req:Request, res:Response) => {
    if(!req.user){
        res.status(400)
        throw new Error('You are not authorised!')
    }

    if(req.user.role !== 'DOCTOR'){
        res.status(400)
        throw new Error('You are not permitted to create meetings!')
    }

    
    const { id } = req.params

    const meeting = await prisma.meeting.findUnique({
        where:{ id: id }
    })

    if(!meeting){
        res.status(404)
        throw new Error(`Meeting with id of ${id} does not exist`)
    }

    if(req.user.id !== meeting.doctorId){
        res.status(400)
        throw new Error('You are not authorized to edit this meeting details')
    }

    if(!req.body){
        res.status(400)
        throw new Error('Please enter input fields')
    }

    const { meetingTime, accept } = req.body as IAcceptMeetingInterface

    if(!meetingTime || !accept){
        res.status(400)
        throw new Error('Please enter input fields')
    }

    // const updateMeeting = await prisma.meeting.update({
    //     where : { id: id },
    //     data:{
    //         patientId: meeting.patientId,
    //         doctorId: meeting.doctorId,
    //         executed: true,
    //         meetingTime: meetingTime,
    //         acceptance: accept
    //     }
    // })

    // res.status(200).json(updateMeeting)

})


export const getInvitedMeetings = asyncHandler(async(req:any, res:Response) => {
    if(!req.user){
        res.status(400)
        throw new Error('You are not authorised!')
    }

    if(req.user.role !== 'DOCTOR'){
        res.status(400)
        throw new Error('You are not permitted to create meetings!')
    }

    const meetings = await prisma.meeting.findMany({
        where:{
            doctorId: req.user.id
        }
    })

    res.status(200).json(meetings)

})
export const getAcceptedMeetings = asyncHandler(async(req:any, res:Response) => {
    if(!req.user){
        res.status(400)
        throw new Error('You are not authorised!')
    }

    if(req.user.role !== 'DOCTOR'){
        res.status(400)
        throw new Error('You are not permitted to create meetings!')
    }

    // const meetings = await prisma.meeting.findMany({
    //     where:{
    //         doctorId: req.user.id,
    //         acceptance: true
    //     }
    // })

    // res.status(200).json(meetings)

})
export const getDeclinedMeetings = asyncHandler(async(req:any, res:Response) => {
    if(!req.user){
        res.status(400)
        throw new Error('You are not authorised!')
    }

    if(req.user.role !== 'DOCTOR'){
        res.status(400)
        throw new Error('You are not permitted to create meetings!')
    }

    // const meetings = await prisma.meeting.findMany({
    //     where:{
    //         doctorId: req.user.id,
    //         acceptance: false
    //     }
    // })

    // res.status(200).json(meetings)

})


