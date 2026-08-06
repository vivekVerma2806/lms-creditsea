import { Role } from '../models/User.js';

export const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role === Role.Admin || roles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  };
};
