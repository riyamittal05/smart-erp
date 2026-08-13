const requireBusiness = (req, res, next) => {
  if (!req.user.businessId) {
    return res.status(400).json({
      message: "Please set up your business profile first.",
    });
  }
  next();
};
module.exports = requireBusiness;