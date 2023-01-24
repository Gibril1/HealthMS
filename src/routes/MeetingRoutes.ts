const router = require('express').Router()

const { protect } = require('../middleware/AuthMiddleware')

const { 
    createMeeting,
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



module.exports = router