export function errorHandler(err, req, res, next) {
  console.error(`💥 [ERROR] ${req.method} ${req.url}:`, err.stack || err.message);

  const statusCode = err.statusCode || (err.message.includes('not found') ? 404 : 500);

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    code: statusCode,
    timestamp: new Date().toISOString()
  });
}
