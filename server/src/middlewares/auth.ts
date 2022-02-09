import { NextFunction, Request, Response } from "express";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.status(404).send("Must be logged in");
  } else {
    return next();
  }
};
