import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const asyncHandler = require('express-async-handler')
import { Response } from 'express'
import { IGetUserAuthInfoRequest } from '../interfaces/AuthInterfaces'
import { IDoctorIDInterface, IExecutedMeeting, IUpdateMeetingDetails } from '../interfaces/BodyInterfaces'

// @desc Create Meeting
// @routes POST /api/meeting
// @access Private Patient
const createMeeting = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {
    if(!req.user){
        res.status(400)
        throw new Error('You are not authorised!')
    }

    if(req.user.role !== 'PATIENT'){
        res.status(400)
        throw new Error('You are not permitted to create meetings!')
    }

    const { doctorId } = req.body as IDoctorIDInterface

    if(!doctorId || doctorId === ''){
        res.status(400)
        throw new Error('Please select a doctor')
    }

    const doctorExists = await prisma.user.findFirst({
        where:{
            id: doctorId
        }
    })

    if(!doctorExists){
        res.status(404)
        throw new Error(`Doctor with id of ${doctorId} does not exist`)
    }

    const meeting = await prisma.meeting.create({
        data:{
            doctorId: doctorId,
            patientId: req.user.id
        }
    })

    res.status(200).json(meeting)
    
})

// @desc Give Remarks After Meeting Has Been Executed
// @routes PUT /api/meeting/:id
// @access Private Patient
const executedMeeting = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {
    try {

        if(!req.user){
            res.status(400)
            throw new Error('You are not authorised!')
        }
    
        if(req.user.role !== 'PATIENT'){
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

        if(req.user.id !== meeting.patientId){
            res.status(400)
            throw new Error('You are not authorized to edit this meeting details')
        }

        const { patientRemarks, rating } = req.body as IExecutedMeeting

        const updatemeeting = await prisma.meeting.update({
            where: {
                id: id
            },
            data:{
                patientId: meeting.patientId,
                doctorId: meeting.doctorId,
                executed: true,
                patientRemarks: patientRemarks ? patientRemarks : null,
                rating: rating ? rating : null
            }
        })

        res.status(200).json(updatemeeting)
    } catch (error:any) {
        res.status(500)
        throw new Error(error.message)
    }
})


// @desc Update Meeting Details
// @routes PUT /api/meeting/:id
// @access Private Patient
const updateMeeting = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {
    try {
        if(!req.user){
            res.status(400)
            throw new Error('You are not authorised!')
        }
    
        if(req.user.role !== 'PATIENT'){
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

        if(req.user.id !== meeting.patientId){
            res.status(400)
            throw new Error('You are not authorized to edit this meeting details')
        }

        if(!req.body){
            res.status(400)
            throw new Error('Please enter all input fields')
        }

        const { patientRemarks, rating,  doctorId } = req.body as IUpdateMeetingDetails

        if(!doctorId || doctorId === ''){
            res.status(400)
            throw new Error('Please select a doctor')
        }
    
        const doctorExists = await prisma.user.findFirst({
            where:{
                id: doctorId
            }
        })
    
        if(!doctorExists){
            res.status(404)
            throw new Error(`Doctor with id of ${doctorId} does not exist`)
        }

        const updatedMeeting = await prisma.meeting.update({
            where: {
                id: id
            },
            data:{
                executed: true,
                patientRemarks: patientRemarks ? patientRemarks : null,
                rating: rating ? rating : null,
                doctorId: doctorId,
                patientId: req.user.id
            }
        })

        res.status(200).json(updatedMeeting)
    } catch (error:any) {
        res.status(500)
        throw new Error(error.message)
    }

})


// @desc Delete A Particular Meeting
// @routes DELETE /api/meetings/:id
// @access Private Patient
const deleteMeeting = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {
    try {
        if(!req.user){
            res.status(400)
            throw new Error('You are not authorised!')
        }
    
        if(req.user.role !== 'PATIENT'){
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

        if(req.user.id !== meeting.patientId){
            res.status(400)
            throw new Error('You are not authorized to delete this meeting details')
        }

        await prisma.meeting.delete({
            where: {id : id}
        })

        res.status(204).json({ id: id })
    } catch (error:any) {
        res.status(500)
        throw new Error(error.message)
    }

})



// @desc Get All Meetings
// @routes GET /api/meetings/
// @access Private Patient
const getMeetings = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {
    try {
        if(!req.user){
            res.status(400)
            throw new Error('You are not authorised!')
        }
    
        if(req.user.role !== 'PATIENT'){
            res.status(400)
            throw new Error('You are not permitted to create meetings!')
        }

        const meetings = await prisma.meeting.findMany({
            where:{
                patientId: req.user.id
            }
        })

        res.status(200).json(meetings)
    } catch (error:any) {
        res.status(500)
        throw new Error(error.message)
    }

})



// @desc Get A Meeting
// @routes GET /api/meeting/:id
// @access Private /Patient
const getMeeting = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {
    if(!req.user){
        res.status(400)
        throw new Error('You are not authorised!')
    }

    if(req.user.role !== 'PATIENT'){
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

    if(req.user.id !== meeting.patientId){
        res.status(400)
        throw new Error('You are not authorized to edit this meeting details')
    }

    res.status(200).json(meeting)

})



module.exports = {
    createMeeting,
    executedMeeting,
    updateMeeting,
    deleteMeeting,
    getMeetings,
    getMeeting
}
