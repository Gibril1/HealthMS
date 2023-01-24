const router = require('express').Router()

const { protect } = require('../middleware/AuthMiddleware')

const {
    createRecords,
    getPatientsRecords,
    getDoctorRecords,
    getRecord,
    updateRecord,
    deleteRecord
} = require('../controllers/RecordControllers')

router.post('/', protect, createRecords)
router.get('/patient', protect, getPatientsRecords)
router.get('/doctor', protect, getDoctorRecords)
router.route('/:id').get(protect, getRecord).put(protect, updateRecord).delete(protect, deleteRecord)

module.exports = router

export {}