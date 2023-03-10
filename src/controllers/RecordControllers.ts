import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const asyncHandler = require('express-async-handler')
import { Response } from 'express'
import { IGetUserAuthInfoRequest } from '../interfaces/AuthInterfaces'
import { IRecordInterface, IPatientIDInterface } from '../interfaces/BodyInterfaces'


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


// @desc Get Doctor's Records
// @routes GET /api/records/
// @access Private Doctor
const getDoctorRecords = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {
    if(!req.user){
        res.status(400)
        throw new Error('You are not authorised!')
    }

    if(req.user.role !== 'DOCTOR'){
        res.status(400)
        throw new Error('You are not permitted to create records!')
    }

    const doctorRecords = await prisma.patientRecords.findMany({
        where: {
            doctorId: req.user.id
        }
    })

    res.status(200).json(doctorRecords)

})


// @desc Get Patient Records
// @routes GET /api/records
// @access Private Doctor
const getPatientsRecords = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {
    if(!req.user){
        res.status(400)
        throw new Error('You are not authorised!')
    }

    if(req.user.role !== 'DOCTOR'){
        res.status(400)
        throw new Error('You are not permitted to create records!')
    }

    const { patientId } = req.body as IPatientIDInterface

    const patientExists = await prisma.user.findFirst({
        where:{
            id: patientId
        }
    })
        
    if(!patientExists){
        res.status(404)
        throw new Error(`Patient with id ${patientId} does not exist`)
    }

    const patientRecords = await prisma.patientRecords.findMany({
        where: {
            patientId: patientId
        }
    })

    res.status(200).json(patientRecords)
})


// @desc Get A Record
// @routes GET /api/records/:id
// @access Private Doctor
const getRecord = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {
    if(!req.user){
        res.status(400)
        throw new Error('You are not authorised!')
    }

    if(req.user.role !== 'DOCTOR'){
        res.status(400)
        throw new Error('You are not permitted to create records!')
    }
    const record = await prisma.patientRecords.findUnique({
        where:{
            id: req.params.id
        }
    })

    if(!record){
        res.status(404)
        throw new Error(`Record with id of ${req.params.id} does not exist`)
    }

    res.status(200).json(record)

})
const updateRecord = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {
    if(!req.user){
        res.status(400)
        throw new Error('You are not authorised!')
    }

    if(req.user.role !== 'DOCTOR'){
        res.status(400)
        throw new Error('You are not permitted to create records!')
    }

    const record = await prisma.patientRecords.findUnique({
        where:{
            id: req.params.id
        }
    })

    if(!record){
        res.status(404)
        throw new Error(`Record with id of ${req.params.id} does not exist`)
    }

    if(req.user.id !== record.doctorId ){
        res.status(400)
        throw new Error('You are not authorized to update this record')
    }

    if(!req.body){
        res.status(404)
        throw new Error('Please enter all fields')
    }

    const { patientId, remarks } = req.body as IRecordInterface

    if(!patientId || patientId === '' || !remarks || remarks === ''){
        res.status(400)
        throw new Error('Please enter input fields')
    }

    const updatedRecord = await prisma.patientRecords.update({
        where:{
            id: req.params.id
        },
        data:{
            remarks: remarks,
            patientId: patientId,
            doctorId: req.user.id
        }
    })

    res.status(200).json(updatedRecord)

})
const deleteRecord = asyncHandler(async(req:IGetUserAuthInfoRequest, res:Response) => {
    if(!req.user){
        res.status(400)
        throw new Error('You are not authorised!')
    }

    if(req.user.role !== 'DOCTOR'){
        res.status(400)
        throw new Error('You are not permitted to create records!')
    }

    const record = await prisma.patientRecords.findUnique({
        where:{
            id: req.params.id
        }
    })

    if(!record){
        res.status(404)
        throw new Error(`Record with id of ${req.params.id} does not exist`)
    }

    if(req.user.id !== record.doctorId ){
        res.status(400)
        throw new Error('You are not authorized to update this record')
    }

    await prisma.patientRecords.delete({
        where:{
            id: req.params.id
        }
    })

    res.status(204).json({ id: req.params.id })
})



module.exports = {
    createRecords,
    getDoctorRecords,
    getPatientsRecords,
    getRecord,
    updateRecord,
    deleteRecord
}