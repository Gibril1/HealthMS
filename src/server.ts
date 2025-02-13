import express from 'express'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/error.middleware'

dotenv.config()
const port = process.env.PORT || 5000

import authRouter from './routes/auth.routes'
import meetingRouter from './routes/meeting.routes'
import doctorRouter from './routes/doctor.routes'
import recordRouter from './routes/record.routes'




// Init app
const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(errorHandler)

// routes
app.use('/api/auth', authRouter)
app.use('/api/records', recordRouter)
app.use('/api/meeting', meetingRouter)
app.use('/api/doctor', doctorRouter)

// Listen to server
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})