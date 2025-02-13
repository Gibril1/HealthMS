import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asynchandler";
import { PrismaClient } from "@prisma/client";
import { IUserModel } from "../interfaces/auth.interfaces";

const prisma = new PrismaClient();

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized. No token");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        }) as IUserModel;

        if (!user) {
            res.status(401);
            throw new Error("User not found");
        }

        // ✅ Type assertion to avoid TypeScript error
        (req as any).user = user;
        next();
    } catch (err) {
        console.log(err);
        res.status(401);
        throw new Error("Not authorized. Invalid token");
    }
});
