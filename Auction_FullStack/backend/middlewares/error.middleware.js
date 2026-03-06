class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode ?? 500;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  const baseError =
    err instanceof ApiError
      ? err
      : new ApiError(err.message || "Internal server error.", err.statusCode || 500);

  let finalError = baseError;

  if (err.name === "JsonWebTokenError") {
    finalError = new ApiError("Json web token is invalid, Try again.", 400);
  }

  if (err.name === "TokenExpiredError") {
    finalError = new ApiError("Json web token is expired, Try again.", 400);
  }

  if (err.name === "CastError") {
    finalError = new ApiError(`Invalid ${err.path}`, 400);
  }

  const errorMessage = finalError.errors
    ? Object.values(finalError.errors)
        .map((error) => error.message)
        .join(" ")
    : finalError.message;

  if (process.env.NODE_ENV !== "test") {
    console.error("[ERROR]", {
      message: errorMessage,
      statusCode: finalError.statusCode,
      stack: finalError.stack,
    });
  }

  return res.status(finalError.statusCode || 500).json({
    success: false,
    message: errorMessage,
  });
};

export default ApiError;