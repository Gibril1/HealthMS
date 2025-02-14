import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import asyncHandler from '../utils/asynchandler'
import { extractActionableSteps } from '../utils/llm'
import { Response, Request } from 'express'
import { IRecordInterface, IPatientIDInterface } from '../interfaces/body.interfaces'


// @desc Create Records 
// @routes POST /api/records/
// @access Private
export const createRecords = asyncHandler(async(req:Request, res:Response) => {
    if(!req.user){
        res.status(401).json({ message: 'You are not authorised' })
        return
    }

    if(req.user.role !== 'DOCTOR'){
        res.status(403).json({ message: 'You are not authorised to add patient records'})
        return
    }

    if(!req.body){
        res.status(400).json({ message: 'Please enter request data'})
        return
    }
    const {
        meetingId,
        notes
    } = req.body as IRecordInterface


    

    if(!meetingId){
        res.status(400).json({ message: 'Please enter meeting ID'})
        return
    }

    if(!notes){
        res.status(400).json({ message: 'Please enter meeting notes '})
        return
    }

    // check if the meeting exists
    const meeting = await prisma.meeting.findUnique({
        where:{
            id: meetingId
        },
        select:{
            id: true,
            doctor:{
                select:{
                    id: true,
                    user:{
                        select:{
                            id: true
                        }
                    }
                }
            },
            patientId: true
        }
    })

    if(!meeting){
        res.status(404).json({ message: 'Such a meeting did not exist'})
        return
    }

    if(meeting.doctor.user.id !== req.user.id){
        res.status(403).json({ message: 'You are not authorised to add meeting records'})
    }

    

    const record = await prisma.patientRecords.create({
        data:{
            notes,
            doctorId: meeting.doctor.id,
            patientId: meeting.patientId,
            meetingId: meeting.id
        }
    })

    // extract actionable steps from llm
    const actionableSteps = await extractActionableSteps(notes);

    console.log({ actionableSteps })
    const newSteps = await Promise.all(
        actionableSteps.map(async (actionableStep) => {
            return prisma.actionableSteps.create({
                data: {
                    task: actionableStep.task,
                    type: actionableStep.type,
                    duration: actionableStep.duration,
                    frequency: actionableStep.frequency,
                    recordId: record.id
                }
            });
        })
    );

    console.log({ newSteps })


    


    res.status(200).json({ message: 'A new meeting record has been added', record})

})


export const getRecords = asyncHandler(async(req:Request, res:Response) => {
    // we are finding all the notes and records for a particular meeting
    const { id } = req.params

    if(!req.user){
        res.status(401).json({ message: 'You are not authorised' })
        return
    }

    const meeting = await prisma.meeting.findUnique({
        where: { id },
        select:{
            id: true,
            patient:{
                select:{
                    user:{
                        select:{
                            id: true
                        }
                    }
                }
            },
            doctor:{
                select:{
                    user:{
                        select:{
                            id: true
                        }
                    }
                }
            }
        }
    })

    if(!meeting){
        res.status(404).json({ message: 'This meeting does not exist' })
        return
    }

    if (req.user.id !== meeting.doctor.user.id && req.user.id !== meeting.patient.user.id) {
        res.status(403).json({ message: 'You cannot access these records' });
        return;
    }
    

    const records = await prisma.patientRecords.findMany({
        where: { meetingId: meeting.id },
        select:{
            id: true,
            notes: true,
            doctor:{
                select:{
                    id: true,
                    firstName: true,
                    lastName: true
                }
            },
            patient:{
                select:{
                    id: true,
                    firstName: true,
                    lastName: true
                }
            },
            actionableSteps:{
                select:{
                    id: true,
                    task: true,
                    type: true,
                    frequency: true,
                    duration: true
                }
            }
        }
    })

    res.status(200).json({ message: 'These are the records', records})
})


