import jwt from "jsonwebtoken";
const isAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Error in isAuth middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default isAuth;