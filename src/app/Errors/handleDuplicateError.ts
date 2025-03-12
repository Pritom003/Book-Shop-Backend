/* eslint-disable @typescript-eslint/no-explicit-any */

import { TGenericErrorResponse } from "../Interface/error.type";


const handleDuplicateError = (err: any): TGenericErrorResponse=> {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorSources = [
    {
      path: '',
      message: `${extractedMessage} is already exist`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Duplicate ID',
    errorSources,
  };
};

export default handleDuplicateError;