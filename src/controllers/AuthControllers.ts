import { Request, Response } from 'express'
const asyncHandler = require('express-async-handler')
const cloudinary = require('../utils/cloudinary')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { IUserInterface } from '../interfaces/AuthInterfaces'


const registerUser = asyncHandler(async(req:Request, res:Response) => {
    if(!req.body){
        res.status(400)
        throw new Error('Please enter all required fields.')
    }

    const { 
        email, 
        password, 
        role,
        firstName,
        lastName,
        otherName,
        dob
         } = req.body as IUserInterface

    let result
    const fileImage = (req as any).file
    if(fileImage){
        result = await cloudinary.uploader.upload(req as any).file.path
    }

    if(!email || email === '' || !password || password === '' || !role ){
        res.status(400)
        throw new Error('Email, Password and Role are required fields.')
    }

    const userExists = await prisma.user.findFirst({
        where: { email: email}
    })

    if(userExists){
        res.status(400)
        throw new Error(`User with email ${email} already exists`)
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword:string = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
        data:{
            email: email,
            password: hashedPassword,
            role: role
        }
    })  
    
    if(user && user.role === 'DOCTOR'){
        await prisma.doctorProfile.create({
            data:{
                firstName: firstName,
                lastName: lastName,
                otherName: otherName,
                dob: dob!,
                userId: user.id,
                cloudinaryId: result ? result.public_id : null,
                avatar: result ? result.secure_url : null
            }
        })
        res.status(200).json({
            "user": user,
            "message":`Account has been created for ${firstName} ${lastName}`
        })
    }else{
        await prisma.patientProfile.create({
           data: {
            firstName: firstName,
            lastName: lastName,
            otherName: otherName,
            dob:  dob!,
            userId: user.id,
            cloudinaryId: result ? result.public_id : null,
            avatar: result ? result.secure_url : null
           }
        })
        res.status(200).json({
            "user": user,
            "message":`Account has been created for ${firstName} ${lastName}`
        })
    }
})

const loginUser = asyncHandler(async(req:Request, res:Response) => {
    // get data from request body
    const { email, password } = req.body

    if(!email || email === '' || !password || password === ''){
        res.status(400)
        throw new Error('Email and password are required fields')
    }

    const user = await prisma.user.findFirst({
        where: { email: email }
    })

    if(!user){
        res.status(404)
        throw new Error(`User with email ${email} does not exist`)
    }

    if(user && bcrypt.compare(password, user.password)){
        res.status(200).json({
            token: generateToken(user.id)
        })
    }else{
        res.status(400)
        throw new Error("Invalid Credentials");
        
    }
})

const generateToken = ( id:string ) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d'})
}

module.exports = {
    registerUser,
    loginUser
}

export {}