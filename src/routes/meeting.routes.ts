import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { 
        createMeeting,
        addMeetingReviews,
        deleteMeeting,
        getMeetings,
       
} from '../controllers/meeting.controllers';

const meetingRouter = Router();

meetingRouter.route('/')
        .get(protect, getMeetings)
        .post(protect, createMeeting)
        .put(protect, addMeetingReviews)

meetingRouter.route('/:id')
        .delete(protect, deleteMeeting)









export default meetingRouter;