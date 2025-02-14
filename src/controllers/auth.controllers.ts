import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import cloudinary from '../utils/cloudinary'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { ILoginUserInterface, IRegisterUserInterface } from '../interfaces/auth.interfaces'
import { isValidEmail, isAlphabetic } from '../utils/validation'



export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const userRoles = ["DOCTOR", "PATIENT"];

        if (!req.body) {
            res.status(400).json({ message: 'Please enter all required fields.' });
            return;
        }

        const { email, password, confirmPassword, role, firstName, lastName } = req.body as IRegisterUserInterface;

        if (!email || !password || !firstName || !lastName) {
            res.status(400).json({ message: 'Please enter all required fields.' });
            return;
        }

        if (!isValidEmail(email)) {
            res.status(400).json({ message: 'Invalid email address' });
            return;
        }

        if (!isAlphabetic(firstName)) {
            res.status(400).json({ message: 'Invalid first name' });
            return;
        }

        if (!isAlphabetic(lastName)) {
            res.status(400).json({ message: 'Invalid last name' });
            return;
        }

        if (password !== confirmPassword) {
            res.status(400).json({ message: 'Passwords do not match' });
            return;
        }

        if (!userRoles.includes(role)) {
            res.status(400).json({ message: 'Invalid role' });
            return;
        }

        const userExists = await prisma.user.findFirst({ where: { email } });

        if (userExists) {
            res.status(400).json({ message: 'User with this email already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: { email, password: hashedPassword, role }
        });

        if (user.role === 'DOCTOR') {
            await prisma.doctorProfile.create({
                data: { firstName, lastName, userId: user.id }
            });
        } else {
            await prisma.patientProfile.create({
                data: { firstName, lastName, userId: user.id }
            });
        }

        res.status(201).json({ message: `Account has been created for ${firstName} ${lastName}` });
    } catch (error) {
        // Pass the error to Express error-handling middleware
    }
});


export const loginUser = asyncHandler(async(req:Request, res:Response) => {
    try {
        // get data from request body
        const { email, password } = req.body as ILoginUserInterface

        if(!email  || !password ){
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

        if(user && await bcrypt.compare(password, user.password)){
            res.status(200).json({
                token: generateToken(user.id)
            })
        }else{
            res.status(400)
            throw new Error("Invalid Credentials");
            
        }
    } catch (error:any) {
        res.status(500)
        throw new Error('Error. Cannot Login. Try Again')
    }
})



const generateToken = ( id:string ):string => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

