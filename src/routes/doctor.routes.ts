import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
    getAcceptedMeetings,
    getDeclinedMeetings,
    acceptOrDeclineMeetings,
    getInvitedMeetings
} from '../controllers/doctor.controllers';

const doctorRouter = Router();

doctorRouter.put('/:id', protect, acceptOrDeclineMeetings);
doctorRouter.get('/meetings', protect, getInvitedMeetings);
doctorRouter.get('/meetings/accept', protect, getAcceptedMeetings);
doctorRouter.get('/meetings/decline', protect, getDeclinedMeetings);

export default doctorRouter;
