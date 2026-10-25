import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'irctc_oomsd_secret_key_2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No authentication token provided.',
      code: 401
    });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired authentication token.',
      code: 403
    });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin privilege required for this resource.',
      code: 403
    });
  }
  next();
}
