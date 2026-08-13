const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only shop admin can do this" });
  }
  next();
};
module.exports = adminOnly;