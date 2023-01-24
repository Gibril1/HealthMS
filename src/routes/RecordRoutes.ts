const router = require('express').Router()

const { protect } = require('../middleware/AuthMiddleware')

const {
    createRecords,
    getRecords,
    getRecord,
    updateRecord,
    deleteRecord
} = require('../controllers/RecordControllers')

router.post('/').post(protect, createRecords).get(protect, getRecords)
router.route('/:id').get(protect, getRecord).put(protect, updateRecord).delete(protect, deleteRecord)

module.exports = router

export {}