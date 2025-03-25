import { User } from '../User/user.model';
// import bcrypt from 'bcrypt';
import  { JwtPayload } from 'jsonwebtoken';
import { TLoginUser, TRegisterUser } from './Auth.interface';
import AppError from '../Errors/AppErrors';
import AuthUtils from './Auth.util';
import config from '../config';
import { sendImageToCloudinary } from '../Utils/SendImageToCloudinary';
// import { sendEmail } from '../Utils/sendEmail';
// import config from '../../config';
// import { TLoginUser, TRegisterUser } from './auth.interface';
// import AppError from '../../Errors/AppError';
// import AuthUtils from './auth.utils';

const login = async (payload: TLoginUser) => { 
  console.log("Received login payload:", payload);

  const user = await User.isUserExists(payload.email);
  console.log("User found in DB:", user);

  if (!user) {
    throw new AppError(404, 'No user found with this email');
  }

  console.log("Entered Password:", payload.password);
  console.log("Stored Hashed Password:", user.password);
  const isPasswordMatched = await User.isPasswordMatched(payload.password, user.password);
  console.log("Password Match Result:", isPasswordMatched);
  
  console.log("Password matched:", isPasswordMatched);

  if (!isPasswordMatched) {
    throw new AppError(401, 'Invalid password');
  }

  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
    image: user.Profileimage || '',
  };

  const accessToken = AuthUtils.CreateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  return { accessToken };
};

const register = async (payload: TRegisterUser,files: any)=> {
  const isUserExists = await User.isUserExists(payload.email);

  if (isUserExists) {
    throw new AppError(400, 'User already exists');
  }

  // Create user first
  const user = await User.create({ ...payload });

  // Handle profile image upload
  let profileImageUpload;
  if (files.Profileimage) {
    profileImageUpload = await sendImageToCloudinary(
      'Profile_' + Date.now(),
      files.Profileimage[0].path
    );
    user.Profileimage = profileImageUpload?.secure_url || '';
  }

  await user.save(); // Save after setting image

  if (!user.Profileimage) {
    throw new AppError(400, 'Profile image is required');
  }


  const jwtPayload = {
    id: user._id,
    email: user.email,
    image: user.Profileimage,
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
  if (!config.jwt_refresh_secret) {
    throw new AppError(500, 'JWT refresh secret is not defined');
  }
  const decoded = AuthUtils.VerifyToken(refreshToken, config.jwt_refresh_secret) as JwtPayload;
  const user = await User.findOne({ _id: decoded.id, is_blocked: false });
  if (!user) throw new AppError(404, 'No user found');

  const jwtPayload = { id: user._id, email: user.email, role: user.role, image: user.Profileimage };
  if (!config.jwt_access_secret || !config.jwt_access_token_expires_in) {
    throw new AppError(500, 'JWT configuration is not defined');
  }
  const accessToken = AuthUtils.CreateToken(jwtPayload, config.jwt_access_secret, config.jwt_access_token_expires_in);

  return { accessToken };
};



// const forgetPassword = async (email: string) => {
//   const user = await User.isUserExists(email);
//   if (!user) throw new AppError(404, 'No user found');
//   if (user.is_blocked) throw new AppError(403, 'User is blocked');

//   const jwtPayload = { id: user._id, email: user.email, role: user.role, image: user.Profileimage || '' };
//   const resetToken = AuthUtils.CreateToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_token_expires_in as string,
//   );

//   const resetUILink = `${config.reset_pass_ui_link}?id=${user._id}&token=${resetToken}`;

//   console.log("Generated reset link:", resetUILink); // Log the link
//   await sendEmail(user.email, resetUILink);
//   return { resetUILink };
// };



// const resetPassword = async (payload: { email: string; newPassword: string }) => {
//   const user = await User.isUserExists(payload.email);
//   if (!user) throw new AppError(404, 'No user found');
//   if (user.is_blocked) throw new AppError(403, 'User is blocked');

//   if (!config.jwt_access_secret) {
//     throw new AppError(500, 'JWT access secret is not defined');
//   }
//   // const decoded = jwt.verify(token, config.jwt_access_secret) as JwtPayload;
//   // if (user._id.toString() !== decoded.userId) throw new AppError(403, 'Unauthorized request');

//   user.password = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds));
//   await User.updateOne({ _id: user._id }, user); // Update the password
// };


// export const AuthService = { register, login, RefreshToken, ChangePassword, forgetPassword, resetPassword };
export const AuthService = { register, login, RefreshToken };