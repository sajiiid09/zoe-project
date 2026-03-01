import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';

/**
 * Verify JWT token and attach the authenticated user to `req.user`.
 * Rejects the request when no valid token is present.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Missing or malformed token'));
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { addresses: true },
    });

    if (!user) {
      return next(new UnauthorizedError('User not found'));
    }

    if (!user.isActive) {
      return next(new UnauthorizedError('Account is deactivated'));
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token expired'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Invalid token'));
    }

    console.error('Auth middleware error:', error);
    return next(error);
  }
};

/**
 * Optionally attach the user when a valid token is present.
 * Allows unauthenticated requests to continue with `req.user = null`.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    req.user = user && user.isActive ? user : null;
    next();
  } catch {
    req.user = null;
    next();
  }
};

/**
 * Require admin role — must run after `requireAuth`.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError());
  }

  if (req.user.role !== 'ADMIN') {
    return next(new ForbiddenError('Admin access required'));
  }

  return next();
};

/**
 * Require vendor role — must run after `requireAuth`.
 */
export const requireVendor = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError());
  }

  if (req.user.role !== 'VENDOR') {
    return next(new ForbiddenError('Vendor access required'));
  }

  return next();
};

/**
 * Require admin or vendor role — must run after `requireAuth`.
 */
export const requireAdminOrVendor = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError());
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'VENDOR') {
    return next(new ForbiddenError('Admin or Vendor access required'));
  }

  return next();
};

/**
 * Require affiliate role — must run after `requireAuth`.
 */
export const requireAffiliate = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError());
  }

  if (req.user.role !== 'AFFILIATE') {
    return next(new ForbiddenError('Affiliate access required'));
  }

  return next();
};

/**
 * Simple in-memory rate limiter.
 */
const rateLimitStore = new Map();

export const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    for (const [ip, data] of rateLimitStore.entries()) {
      if (data.windowStart < windowStart) {
        rateLimitStore.delete(ip);
      }
    }

    const entry = rateLimitStore.get(key) || { count: 0, windowStart: now };

    if (entry.windowStart < windowStart) {
      entry.count = 1;
      entry.windowStart = now;
    } else {
      entry.count++;
    }

    rateLimitStore.set(key, entry);

    if (entry.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil((entry.windowStart + windowMs - now) / 1000),
      });
    }

    next();
  };
};

/**
 * Wraps async route handlers so thrown errors reach the global error handler.
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};
