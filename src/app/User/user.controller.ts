
import AppError from '../Errors/AppErrors';
import CatchAsync from '../Utils/CatchAsync';
import sendResponse from '../Utils/sendResponse';
// import { UserInterface } from './user.Interface';
import UserService from './user.service';

const getMyProfile = CatchAsync(async (req, res) => {
  const user = req.user ;

  if (!user) {
    throw new AppError(401, 'Unauthorized');
  }
  const result = await UserService.GetMyProfile(user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User profile fetched successfully',
    data: result,
  });
});

const getAllCustomers = CatchAsync(async (req, res) => {
  const result = await UserService.GetAllCustomers(req.query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Customers fetched successfully',
    // meta: result.meta,
    data: result.data,
  });
});
const updateMyProfile = CatchAsync(async (req, res) => {
  
  const { oldPassword, newPassword, ...body } = req.body;
  console.log(req.body);
  const files = req.files as any;

  const result = await UserService.updateMyProfile(files, { ...body, oldPassword, newPassword });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Profile updated successfully',
    data: result,
  });
});

const blockUser = CatchAsync(async (req, res) => {
  const { userId } = req.params;
  

  await UserService.BlockUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User blocked successfully',
    data: {},
  });
});
const makeAdmin = CatchAsync(async (req, res) => {
  const { userId } = req.params;
  await UserService.MakeAdmin(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User is now an Admin",
    data: {},
  });
});

const removeAdmin = CatchAsync(async (req, res) => {
  const { userId } = req.params;
  await UserService.RemoveAdmin(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Admin role removed",
    data: {},
  });
});

const deleteUser = CatchAsync(async (req, res) => {
  const { userId } = req.params;
  await UserService.DeleteUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: {},
  });
});

export const UserController = { getMyProfile, blockUser, getAllCustomers ,updateMyProfile ,  makeAdmin,
  removeAdmin,deleteUser,};