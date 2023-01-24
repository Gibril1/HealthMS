const router = require('express').Router()
const { protect } = require('../middleware/AuthMiddleware')

const {
    getAcceptedMeetings,
    getDeclinedMeetings,
    acceptOrDeclineMeetings,
    getInvitedMeetings
} = require('../controllers/DoctorControllers')

router.put('/:id', protect, acceptOrDeclineMeetings)
router.get('/meetings', protect, getInvitedMeetings)
router.get('/meetings/accept', protect, getAcceptedMeetings)
router.get('/meetings/decline', protect, getDeclinedMeetings)

module.exports = router

export {}