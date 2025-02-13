import { Request } from "express"

export interface IUserModel  {
    id: string,
    email: string,
    password: string,
    role: string

}

export interface IRegisterUserInterface {
    email: string,
    password: string,
    role: string ,
    firstName: string,
    lastName: string,
    otherName: string,
    dob: Date | null 
}

export interface ILoginUserInterface {
    email: string,
    password: string
}

export interface IGetUserAuthInfoRequest extends Request {
    user: IUserModel 
}

export type IAuthRequest = IGetUserAuthInfoRequest & {
    headers: { authorization: string };
};