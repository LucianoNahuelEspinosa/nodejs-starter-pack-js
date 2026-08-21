import consolePrintWithTimedate from '#src/helpers/consolePrintWithTimedate.js';

/**
 * Global Error Handler Middleware
 * * @param {Error} err - The error object
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @param {import("express").NextFunction} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  const errorLog = `[${req.method}] ${req.url}\nMessage: "${err.message}"\nStack: ${err.stack}\n\n`;

  console.error('❌ Error detected:');
  consolePrintWithTimedate("error", errorLog, true, "en-US");

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;