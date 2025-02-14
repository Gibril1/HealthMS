import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
    acceptOrDeclineMeetings,
    getInvitedMeetings
} from '../controllers/doctor.controllers';

const doctorRouter = Router();

doctorRouter.put('/meetings/:id', protect, acceptOrDeclineMeetings);
doctorRouter.get('/meetings', protect, getInvitedMeetings);


export default doctorRouter;
