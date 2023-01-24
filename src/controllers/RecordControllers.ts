import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const asyncHandler = require('express-async-handler')
import { Response } from 'express'
import { IGetUserAuthInfoRequest } from '../interfaces/AuthInterfaces'
import { IRecordInterface } from '../interfaces/BodyInterfaces'


// @desc Create Records 
// @routes POST /api/records/
// @access Private
const createRecords = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {
    if(!req.user){
        res.status(400)
        throw new Error('You are not authorised!')
    }

    if(req.user.role !== 'DOCTOR'){
        res.status(400)
        throw new Error('You are not permitted to create records!')
    }

    const {
        patientId,
        remarks
    } = req.body as IRecordInterface


    if(!req.body){
        res.status(400)
        throw new Error('Please enter input fields')
    }

    if(!patientId || patientId === '' || !remarks || remarks === ''){
        res.status(400)
        throw new Error('Please enter input fields')
    }

    const patientExists = await prisma.user.findFirst({
        where:{
            id: patientId
        }
    })
        
    if(!patientExists){
        res.status(404)
        throw new Error(`Patient with id ${patientId} does not exist`)
    }

    const record = await prisma.patientRecords.create({
        data:{
            remarks: remarks,
            doctorId: req.user.id,
            patientId: patientId
        }
    })

    res.status(200).json(record)

})
const getRecords = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {

})
const getRecord = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {

})
const updateRecord = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {

})
const deleteRecord = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {

})

module.exports = {
    createRecords,
    getRecords,
    getRecord,
    updateRecord,
    deleteRecord
}