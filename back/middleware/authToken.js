import jwt from "jsonwebtoken";

 function authenticateToken(req, res, next) {

  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; 
    next(); 
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
}


export default authenticateToken;