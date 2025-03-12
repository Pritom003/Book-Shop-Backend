import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../Interface/error.type';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse=> {
  const errorSources = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};

export default handleCastError;