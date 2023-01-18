import { Request, Response } from 'express'
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const registerUser = asyncHandler(async(req:Request, res:Response) => {
    
})

const loginUser = asyncHandler(async(req:Request, res:Response) => {

})

const generateToken = ( id:string ) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d'})
}

module.exports = {
    registerUser,
    loginUser
}

export {}