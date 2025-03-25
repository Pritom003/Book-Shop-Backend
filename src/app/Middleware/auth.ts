import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import config from '../config';
import CatchAsync from '../Utils/CatchAsync';
import AppError from '../Errors/AppErrors';
import { User } from '../User/user.model';
import { UserInterface } from '../User/user.Interface';


type Role = 'ADMIN' | 'USER';


declare module 'express' {
  interface Request {
    user?:UserInterface;
  }
}

const auth = (...roles: Role[]) => {
  return CatchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      const bearerToken = req.headers.authorization;
      console.log("🔵 Received Authorization Header:", req.headers.authorization);
    
      if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
        throw new AppError(401, 'Invalid or missing authorization header');
      }

      const token = bearerToken.split(' ')[1];
      console.log("🔵 Extracted Token:", token);
      if (!token) {
        throw new AppError(401, "You're not authorized to access this route");
      }

      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
      console.log("🟢 Decoded Token:", decoded);
      const { email } = decoded;

      const user = await User.isUserExists(email);

      if (!user) {
        throw new AppError(401, "You're not authorized to access this route");
      }

      if (roles.length && !roles.includes(user.role)) {
        throw new AppError(
          403,
          "You don't have permission to access this route",
        );
      }

      req.user = user;

      next();
    },
  );
};
export default auth;