const jwt = require("jsonwebtoken");

module.exports = function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Missing JWT_SECRET in .env" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};