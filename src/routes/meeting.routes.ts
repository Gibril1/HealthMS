import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { 
        createMeeting,
        executedMeeting,
        updateMeeting,
        deleteMeeting,
        getMeetings,
        getMeeting,
        getAcceptedMeetings,
        getDeclinedMeetings,
        getExecutedMeetings
} from '../controllers/meeting.controllers';

const meetingRouter = Router();

meetingRouter.route('/')
        .get(protect, getMeetings)
        .post(protect, createMeeting)

meetingRouter.route('/:id')
        .get(protect, getMeeting)
        .put(protect, updateMeeting)
        .delete(protect, deleteMeeting)

meetingRouter.put('/executed/:id', protect, executedMeeting )
meetingRouter.get('/executed/', protect, getExecutedMeetings)

meetingRouter.get('/accepted', protect, getAcceptedMeetings)
meetingRouter.get('/declined', protect, getDeclinedMeetings)




export default meetingRouter;