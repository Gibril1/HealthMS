const router = require('express').Router()

const { protect } = require('../middleware/AuthMiddleware')

const { 
    createMeeting,
    executedMeeting,
    updateMeeting,
    deleteMeeting,
    getMeetings,
    getMeeting
} = require('../controllers/MeetingControllers')

router.route('/')
        .get(protect, getMeetings)
        .post(protect, createMeeting)

router.route('/:id')
        .get(protect, getMeeting)
        .put(protect, updateMeeting)
        .delete(protect, deleteMeeting)

router.put('/executed/:id', protect, executedMeeting )





module.exports = router