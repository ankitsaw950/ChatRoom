import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
  try {
    // Retrieve token from cookies or the Authorization header
    const token =
      req.cookies.token ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    // console.log("Token:", token); // Debugging token value

    // If no token is found, return an unauthorized response
    if (!token) {
      return res.status(401).send({
        error: "Unauthorized user",
      });
    }

    // Check if the token is blacklisted in Redis
    const isBlackListed = await redisClient.get(token);
    if (isBlackListed) {
      res.cookie("token", ""); // Clear the token cookie
      return res.status(401).send({
        error: "Unauthorized user",
      });
    }

    // Verify the token and attach the decoded payload to the request object
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error in authUser middleware:", error);
    res.status(401).send({
      message: "Not authorized, token is missing or invalid",
    });
  }
};
