const router = require('express').Router()

const { protect } = require('../middleware/AuthMiddleware')

const { 
    createMeeting,
    executedMeeting,
    updateMeeting,
    deleteMeeting,
    getMeetings,
    getMeeting,
    getAcceptedMeetings,
    getDeclinedMeetings,
    getExecutedMeetings
} = require('../controllers/MeetingControllers')

router.route('/')
        .get(protect, getMeetings)
        .post(protect, createMeeting)

router.route('/:id')
        .get(protect, getMeeting)
        .put(protect, updateMeeting)
        .delete(protect, deleteMeeting)

router.put('/executed/:id', protect, executedMeeting )
router.get('/executed/', protect, getExecutedMeetings)

router.get('/accepted', protect, getAcceptedMeetings)
router.get('/declined', protect, getDeclinedMeetings)





module.exports = router