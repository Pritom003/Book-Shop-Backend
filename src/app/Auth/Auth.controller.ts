
import { Request, Response } from 'express';
import CatchAsync from '../Utils/CatchAsync';
import { AuthService } from './Auth.service';
import sendResponse from '../Utils/sendResponse';
// import AppError from '../Errors/AppErrors';

const register = CatchAsync(async (req: Request, res: Response) => {
  const files = req.files as any;
  const result = await AuthService.register(req.body,files);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const login = CatchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Login successful',
    data: result,
  });
});


export const AuthController = {
  register,
  login
};