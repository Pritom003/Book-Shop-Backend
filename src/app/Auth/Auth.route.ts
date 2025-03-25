// import { Router } from 'express';

import { upload } from '../Utils/SendImageToCloudinary';
import { AuthController } from './Auth.controller';
import express from 'express';
// const router = Router();

const Authrouter = express.Router();
Authrouter.post('/register',upload.fields([
    { name: 'Profileimage', maxCount: 1 },
  ]),
 AuthController.register);

Authrouter.post('/login', AuthController.login);

export default Authrouter;
