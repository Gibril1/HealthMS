const express = require('express')
require('dotenv').config()
const port = process.env.PORT || 5000
const { errorHandler } = require('./middleware/ErrorMiddleware')



// Init app
const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(errorHandler)

// routes
app.use('/api/auth', require('./routes/AuthRoutes'))
app.use('/api/records', require('./routes/RecordRoutes'))
app.use('/api/meeting', require('./routes/MeetingRoutes'))
app.use('/api/doctor', require('./routes/DoctorRoutes'))

// Listen to server
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})