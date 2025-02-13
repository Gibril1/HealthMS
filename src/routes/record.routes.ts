import { Router } from 'express'
import { protect } from '../middleware/auth.middleware'
import {
    createRecords,
    getPatientsRecords,
    getDoctorRecords,
    getRecord,
    updateRecord,
    deleteRecord
} from '../controllers/record.controllers'

const recordRouter = Router()

recordRouter.post('/', protect, createRecords)
recordRouter.get('/patient', protect, getPatientsRecords)
recordRouter.get('/doctor', protect, getDoctorRecords)
recordRouter.route('/:id')
    .get(protect, getRecord)
    .put(protect, updateRecord)
    .delete(protect, deleteRecord)

export default recordRouter