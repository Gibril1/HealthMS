import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import asyncHandler from '../utils/asynchandler';
import { Response, Request } from 'express';
import { IAcceptMeetingInterface } from '../interfaces/body.interfaces';

// route to fetch meetings where the doctor has been invited
export const getInvitedMeetings = asyncHandler(async (req: Request, res: Response) => {
    // Ensure the user is authenticated
    if (!req.user) {
        res.status(401).json({ message: 'You are not authorised' });
        return;
    }

    // Only doctors can access this route
    if (req.user.role !== 'DOCTOR') {
        res.status(403).json({ message: 'You are not authorised' });
        return
    }

    // Retrieve the doctor's profile based on the user ID
    const doctorProfile = await prisma.doctorProfile.findUnique({
        where: {
            userId: req.user.id
        }
    });

    if (!doctorProfile) {
        res.status(404).json({ message: 'Please create a profile' });
        return;
    }

    // Extract status from query parameters
    const { status } = req.query;

    // Ensure `status` is valid (optional but recommended)
    const validStatuses = ['PENDING', 'ACCEPTED', 'DECLINED'];
    if (status && !validStatuses.includes(status as string)) {
        res.status(400).json({ message: 'Invalid status' });
        return;
    }

    // Fetch all meetings where the doctor is invited
    const meetings = await prisma.meeting.findMany({
        where: {
            doctorId: doctorProfile.id,
            status: status as string || undefined  // Only filter by status if provided
        },
        select: {
            status: true,
            patient: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            }
        }
    });

    res.status(200).json(meetings);
});

// Endpoint for accepting or declining a meeting
export const acceptOrDeclineMeetings = asyncHandler(async (req: Request, res: Response) => {
    // Ensure the user is authenticated
    if (!req.user) {
        res.status(401).json({ message: 'You are not authorised' });
        return;
    }

    // Only doctors can access this route
    if (req.user.role !== 'DOCTOR') {
        res.status(403).json({ message: 'You are not permitted to accept or decline meetings' });
        return;
    }

    // Ensure request body is not empty
    if (!req.body) {
        res.status(400).json({ message: 'Please enter all fields' });
        return;
    }

    const { meetingTime, status } = req.body as IAcceptMeetingInterface;

    if(!status){
        res.status(400).json({ message: 'Please set the status of the meeting'})
        return
    }

    // If the meeting is being accepted, a valid meeting time must be provided
    if (status === 'ACCEPTED' && !meetingTime) {
        res.status(400).json({ message: 'Since you have accepted, please set the meeting date and time' });
        return;  
    }

    // Validate meetingTime if provided
    if (meetingTime && typeof meetingTime === 'string' && isNaN(Date.parse(meetingTime))) {
        res.status(400).json({ message: 'Invalid meeting date and time' });
        return;
    }

    // Retrieve the doctor's profile based on the user ID
    const doctorProfile = await prisma.doctorProfile.findUnique({
        where: {
            userId: req.user.id
        }
    });

    if (!doctorProfile) {
        res.status(404).json({ message: 'Please create a profile' });
        return;
    }

    // Get meeting ID from request params
    const { id } = req.params;

    // Find the meeting with the provided ID
    const meeting = await prisma.meeting.findUnique({
        where: { id: id }
    });

    if (!meeting) {
        res.status(404).json({ message: 'There is no such meeting' });
        return;
    }

    // Ensure the meeting belongs to the doctor making the request
    if (doctorProfile.id !== meeting.doctorId) {
        res.status(400);
        throw new Error('You are not authorized to edit this meeting details');
    }

    // Update the meeting status and time if provided
    const updateMeeting = await prisma.meeting.update({
        where: { id: id },
        data: {
            meetingTime: meetingTime ? new Date(meetingTime) : meeting.meetingTime,  // Convert to Date object
            status
        }
    });

    res.status(200).json({ message: 'You have set the status of the meeting' });
});
