import { User } from '../User/user.model';
import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { TLoginUser, TRegisterUser } from './Auth.interface';
import AppError from '../Errors/AppErrors';
import AuthUtils from './Auth.util';
import config from '../config';
// import config from '../../config';
// import { TLoginUser, TRegisterUser } from './auth.interface';
// import AppError from '../../Errors/AppError';
// import AuthUtils from './auth.utils';

const login = async (payload: TLoginUser) => {
  const user = await User.isUserExists(payload.email);

  if (!user) {
    throw new AppError(404, 'No user found with this email');
  }

  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(401, 'Invalid password');
  }

  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = AuthUtils.CreateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  const refreshToken = AuthUtils.CreateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  return { accessToken, refreshToken };
};

const register = async (payload: TRegisterUser) => {
  const isUserExists = await User.isUserExists(payload.email);

  if (isUserExists) {
    throw new AppError(400, 'User already exists');
  }

  const user = await User.create({ ...payload });

  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = AuthUtils.CreateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  const refreshToken = AuthUtils.CreateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  return { accessToken, refreshToken };
};

const RefreshToken = async (refreshToken: string) => {
  const decoded = AuthUtils.VerifyToken(
    refreshToken,
    config.jwt_access_token_expires_in as string,
  ) as JwtPayload;

  const user = await User.findOne({ _id: decoded.id, is_blocked: false });

  if (!user) {
    throw new AppError(404, 'No user found');
  }

  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = AuthUtils.CreateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  return { accessToken };
};

const ChangePassword = async (
  payload: {
    oldPassword: string;
    newPassword: string;
  },
  user: JwtPayload,
) => {
  const isUserValid = await User.findOne({
    _id: user.id,
    is_blocked: false,
  }).select('+password');

  if (!isUserValid) {
    throw new AppError(404, 'No user found');
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    isUserValid.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(401, 'Invalid password');
  }

  isUserValid.password = payload.newPassword;
  await isUserValid.save();
};

export const AuthService = {
  register,
  login,
  RefreshToken,
  ChangePassword,
};