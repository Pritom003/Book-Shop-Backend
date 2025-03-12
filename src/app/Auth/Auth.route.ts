// import { Router } from 'express';
import { AuthController } from './Auth.controller';
import express from 'express';
// const router = Router();

const Authrouter = express.Router();
Authrouter.post('/register', AuthController.register);
Authrouter.post('/login', AuthController.login);
export default Authrouter;
