import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
    getAcceptedMeetings,
    getDeclinedMeetings,
    acceptOrDeclineMeetings,
    getInvitedMeetings
} from '../controllers/doctor.controllers';

const router = Router();

router.put('/:id', protect, acceptOrDeclineMeetings);
router.get('/meetings', protect, getInvitedMeetings);
router.get('/meetings/accept', protect, getAcceptedMeetings);
router.get('/meetings/decline', protect, getDeclinedMeetings);

export default router;
