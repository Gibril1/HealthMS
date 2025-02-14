import { Router } from 'express'
import { protect } from '../middleware/auth.middleware'
import {
    createRecords,
    getRecords
} from '../controllers/record.controllers'

const recordRouter = Router()

recordRouter.post('/', protect, createRecords)
recordRouter.get('/:id', protect, getRecords)



export default recordRouter