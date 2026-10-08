const createApiError = (statusCode, message, details = undefined) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.details = details;
    return error;
  };
  
  export const ApiError = {
    badRequest: (message, details) =>
      createApiError(400, message, details),
  
    unauthorized: (message = 'Unauthorized') =>
      createApiError(401, message),
  
    forbidden: (message = 'Forbidden') =>
      createApiError(403, message),
  
    notFound: (message = 'Not found') =>
      createApiError(404, message),
  };