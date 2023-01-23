

import { Role } from "@prisma/client"

export interface IUserInterface {
    email: string,
    password: string,
    role: Role ,
    firstName: string,
    lastName: string,
    otherName: string,
    dob: Date | null 
}

