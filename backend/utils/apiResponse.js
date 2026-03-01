export const sendSuccess = (res, data = null, message = null, statusCode = 200) => {
  const payload = { success: true };

  if (message) {
    payload.message = message;
  }

  if (data !== null) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

export const sendError = (res, message, statusCode = 500, details = null, code = null) => {
  const payload = {
    success: false,
    message,
  };

  if (code) {
    payload.code = code;
  }

  if (details) {
    payload.details = details;
  }

  return res.status(statusCode).json(payload);
};
