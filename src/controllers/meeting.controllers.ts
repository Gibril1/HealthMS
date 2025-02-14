import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import asyncHandler from '../utils/asynchandler'
import { NextFunction, Response, Request } from 'express'
import { IDoctorIDInterface, IAddReviewInterface, IUpdateMeetingDetails } from '../interfaces/body.interfaces'
import { Console } from 'console'

// @desc Create Meeting
// @routes POST /api/meeting
// @access Private Patient
export const createMeeting = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'You are not authorised!' });
            return;  // Ensure function exits after response
        }

        console.log("user id", req.user.id)
        console.log("user role", req.user.role)

        if (req.user.role !== 'PATIENT') {
            res.status(403).json({ message: 'You are not permitted to create meetings!' });
            return;
        }

        const { doctorId } = req.body as IDoctorIDInterface;

        if (!doctorId) {
            res.status(400).json({ message: 'Please select a doctor.' });
            return;
        }

        const patientProfile = await prisma.patientProfile.findUnique({
            where: { userId: req.user.id }
        })

        console.log("patient profile", patientProfile)

        if(!patientProfile){
            res.status(404).json({ message: 'Kindly create a patient profile'})
            return
        }

        console.log("patient profile", patientProfile.id)


        const doctorExists = await prisma.doctorProfile.findUnique({
            where: { id: doctorId }
        });

        if (!doctorExists) {
            res.status(404).json({ message: `Doctor with ID ${doctorId} does not exist.` });
            return;
        }

        // Check for existing meeting
        const lastMeeting = await prisma.meeting.findFirst({
            where: { patientId: patientProfile.id, doctorId },
            orderBy: { createdAt: 'desc' }
        });

        if (lastMeeting) {
            switch (lastMeeting.status) {
                case 'PENDING':
                    res.status(200).json({ message: 'You already have a pending meeting with this doctor.' });
                    return;

                case 'ACCEPTED':
                    res.status(200).json({ message: 'You already have an accepted meeting with this doctor.' });
                    return;

                case 'REJECTED':
                    // Allow creating a new meeting if the last one was rejected
                    break;

                default:
                    res.status(400).json({ message: 'Unknown meeting status.' });
                    return;
            }
        }

        // Create new meeting
        await prisma.meeting.create({
            data: { doctorId, patientId: patientProfile.id }
        });

        res.status(201).json({
            message: `A meeting has been set between you and Dr. ${doctorExists.firstName} ${doctorExists.lastName}. You will receive a notification when the doctor sets a meeting time.`
        });
    } catch (error) {
        next(error); // Pass error to Express error handler
    }
});

// @desc Get All Meetings
// @routes GET /api/meetings/
// @access Private Patient
export const getMeetings = asyncHandler(async(req:any, res:Response) => {
    try {
        if(req.user.role !== 'PATIENT'){
            res.status(400).json({ message: 'You are not permitted to create meetings'})
            return;
        }

        const { status } = req.query

        console.log("status", status)

        const patientProfile = await prisma.patientProfile.findUnique({
            where: { userId: req.user.id }
        })

        if(!patientProfile){
            res.status(404).json({ message: 'Kindly create a patient profile'})
            return
        }

        const meetings = await prisma.meeting.findMany({
            where:{
                patientId: patientProfile.id,
                status
            },
            select:{
                id: true,
                status: true,
                doctor:{
                    select:{
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        })

        res.status(200).json(meetings)
    } catch (error:any) {
        res.status(500)
        throw new Error(error.message)
    }

})





// @desc Delete A Particular Meeting
// @routes DELETE /api/meetings/:id
// @access Private Patient
export const deleteMeeting = asyncHandler(async(req:any, res:Response) => {
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

        // you can only delete pending meetings
        if(meeting.status !== 'PENDING'){
            res.status(400).json({ message: 'You can only delete pending meetings'})
            return
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







// @desc Add Reviews
// @routes PUT /api/meeting/:id
// @access Private /Patient
export const addMeetingReviews = asyncHandler(async (req: any, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: 'You are not authorized' });
        return;
    }

    if (req.user.role !== 'PATIENT') {
        res.status(403).json({ message: 'You are not permitted to add a review!' });
        return;
    }

    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ message: 'There is no request body' });
        return;
    }

    const patientProfile = await prisma.patientProfile.findUnique({
        where: { userId: req.user.id }
    });

    if (!patientProfile) {
        res.status(404).json({ message: 'Kindly create a patient profile' });
        return;
    }

    console.log("Patient profile ID:", patientProfile.id);

    const { review, meetingId } = req.body as IAddReviewInterface;

    if (!review) {
        res.status(400).json({ message: 'Add your review' });
        return;
    }

    if (!meetingId) {
        res.status(400).json({ message: 'There is no meeting ID' });
        return;
    }

    const meeting = await prisma.meeting.findUnique({
        where: { id: meetingId }
    });

    if (!meeting) {
        res.status(404).json({ message: 'No such meeting exists' });
        return;
    }

    if (meeting.status !== 'ACCEPTED' || (meeting.meetingTime && meeting.meetingTime > new Date())) {
        res.status(400).json({ message: 'You cannot give a review for a meeting you have not had yet' });
        return;
    }
    

    if (!meeting.patientId || patientProfile.id !== meeting.patientId) {
        res.status(403).json({ message: 'You are not authorized to edit this meeting details' });
        return;
    }

    const newReview = await prisma.meeting.update({
        where: { id: meeting.id },
        data: { review }
    });

    res.status(200).json({ message: 'You have added your review', newReview });
});



