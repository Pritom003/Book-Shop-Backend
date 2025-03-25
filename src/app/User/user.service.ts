import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';

import { User } from './user.model';
import QueryBuilder from '../bulilder/QueryBuilder';
import AppError from '../Errors/AppErrors';
import { UserInterface } from './user.Interface';
import { sendImageToCloudinary } from '../Utils/SendImageToCloudinary';
import config from '../config';
// import config from '../config';


const GetMyProfile = async (user :UserInterface) => {
  const result = await User.findOne({
    email: user.email,
    is_blocked: false,
  }).select('-is_blocked -createdAt -updatedAt');

  if (!result) {
    throw new AppError(404, 'User not found');
  }

  return result;
};

const GetAllCustomers = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(User.find({ role: ['USER', 'ADMIN'] }), query);

  const users = await queryBuilder
    .search(['name', 'email'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .modelQuery.select('-password -updatedAt');

  const total = await queryBuilder.getCountQuery();

  return {
    meta: {
      total,
      ...queryBuilder.getPaginationInfo(),
    },
    data: users,
  };
};
const updateMyProfile = async (files: any, data: JwtPayload) => {
  try {
    const user = await User.findById(data.id).select("+password");
    if (!user) {
      throw new AppError(404, "User not found");
    }

    // Upload new profile image if provided
    const profileImageUpload = files.Profileimage
      ? await sendImageToCloudinary("profile_" + Date.now(), files.Profileimage[0].path)
      : undefined;

    if (profileImageUpload) {
      data.Profileimage = profileImageUpload.secure_url;
    }

    // Check if the user provided old password and validate it
    if (data.oldPassword && !(await User.isPasswordMatched(data.oldPassword, user?.password))) {
      throw new AppError(401, 'Old password does not match');
    }

    // If a new password is provided, hash it and update
    if (data.newPassword) {
      const newHashedPassword = await bcrypt.hash(
        data.newPassword,
        Number(config.bcrypt_salt_rounds),
      );
      user.password = newHashedPassword;
      user.needsPasswordChange = false;
      user.passwordChangedAt = new Date();
    }

    // Update profile fields only if new values are provided
    user.name = data.name || user.name;
    user.Profileimage = data.Profileimage || user.Profileimage;

    await User.findByIdAndUpdate({ _id: data.id }, user);

    return user;
  } catch (error: any) {
    // Handle errors with the AppError custom class
    throw new AppError(error.statusCode || 500, error.message || "Something went wrong");
  }
};




const BlockUser = async (targatedUserId: string) => {
  const targatedUser = await User.findById(targatedUserId);

  if (!targatedUser) {
    throw new AppError(404, 'User not found');
  }



  await User.findByIdAndUpdate(targatedUserId, {
    is_blocked: targatedUser.is_blocked ? false : true,
  });
};
const MakeAdmin = async (targetUserId: string) => {
  const user = await User.findById(targetUserId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.role === "ADMIN") {
    throw new AppError(400, "User is already an admin");
  }

  user.role = "ADMIN";
  await user.save();
};

const RemoveAdmin = async (targetUserId: string) => {
  const user = await User.findById(targetUserId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.role === "USER") {
    throw new AppError(400, "User is not an admin");
  }

  user.role = "USER";
  await user.save();
};

const DeleteUser = async (targetUserId: string) => {
  const user = await User.findByIdAndDelete(targetUserId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return { message: "User deleted successfully" };
};
const UserService = { GetMyProfile, GetAllCustomers, BlockUser ,updateMyProfile ,MakeAdmin,RemoveAdmin,DeleteUser};

export default UserService;