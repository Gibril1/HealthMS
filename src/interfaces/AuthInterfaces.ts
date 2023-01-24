import { Role } from "@prisma/client"
import { Request } from "express"
export interface IUserModel  {
    id: string,
    email: string,
    password: string,
    role: Role

}

export interface IUserInterface {
    email: string,
    password: string,
    role: Role ,
    firstName: string,
    lastName: string,
    otherName: string,
    dob: Date | null 
}

export interface IGetUserAuthInfoRequest extends Request {
    user: IUserModel | null
}

export type IAuthRequest = IGetUserAuthInfoRequest & {
    headers: { authorization: string };
};