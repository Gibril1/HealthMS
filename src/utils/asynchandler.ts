import { Request, Response, NextFunction } from 'express';

type AsyncHandler = <T extends Request>(fn: (req: T, res: Response, next: NextFunction) => Promise<void>) => (req: T, res: Response, next: NextFunction) => void;

const asyncHandler: AsyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;