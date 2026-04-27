const ROLES = Object.freeze({
  ADMIN: 'admin',
  OFFICER: 'officer',
  STUDENT: 'student',
});

const VALID_ROLES = new Set(Object.values(ROLES));

const isRbacEnabled = () => String(process.env.RBAC_ENABLED).toLowerCase() === 'true';

const normalizeRole = (role) => String(role || '').trim().toLowerCase();
const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const getAdminEmails = () =>
  String(process.env.RBAC_ADMIN_EMAILS || '24z218@psgtech.ac.in')
    .split(',')
    .map((entry) => normalizeEmail(entry))
    .filter(Boolean);

const authenticateRequest = (req, res, next) => {
  if (!isRbacEnabled()) {
    req.authUser = {
      id: 'dev-local-user',
      role: ROLES.ADMIN,
    };
    return next();
  }

  const userId = req.headers['x-user-id'];
  const email = normalizeEmail(req.headers['x-user-email']);
  const role = normalizeRole(req.headers['x-user-role']);
  const adminEmails = new Set(getAdminEmails());
  const resolvedRole = adminEmails.has(email) ? ROLES.ADMIN : role || ROLES.STUDENT;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: missing x-user-id header',
    });
  }

  if (!VALID_ROLES.has(resolvedRole)) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: invalid role context',
    });
  }

  req.authUser = {
    id: String(userId),
    email,
    role: resolvedRole,
  };

  return next();
};

const authorize = (...allowedRoles) => {
  const normalizedAllowedRoles = new Set(allowedRoles.map(normalizeRole));

  return (req, res, next) => {
    if (!isRbacEnabled()) {
      return next();
    }

    if (!req.authUser) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: authentication context missing',
      });
    }

    if (!normalizedAllowedRoles.has(req.authUser.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: insufficient role permissions',
      });
    }

    return next();
  };
};

module.exports = {
  ROLES,
  authenticateRequest,
  authorize,
};
