import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      // console.log(token)
      if (!token) {
        return res.status(401).json({
          error: "Unauthorized request",
        });
      }
  
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken?._id).select(
        "-password"
      );
  
      if (!user) {
        return res.json({
          status: 401,
          error: "Invalid Access Token",
        });
      }
  
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        status: 401,
        error: error?.message || "Invalid access token",
      });
    }
  });


  async function beforeLogin(req, res, next) {
    const providedApiKey = req.headers.apikey;
    const providedSecretKey = req.headers.secretkey;
  
    const correctApiKey = process.env.API_KEY;
    const correctSecretKey = process.env.SECRET_KEY;
  
    if (!providedApiKey || providedApiKey !== correctApiKey) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid API key",
      });
    }
  
    if (!providedSecretKey || providedSecretKey !== correctSecretKey) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid secret key",
      });
    }
  
    next();
  }

  export {
    verifyJWT,
    beforeLogin
  }

  