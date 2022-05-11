import { NextFunction, Request, Response } from "express";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.status(404).json("Must be logged in");
  } else {
    return next();
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user?.isAdmin) {
    return res.status(404).json("Must be an admin");
  } else {
    return next();
  }
};
