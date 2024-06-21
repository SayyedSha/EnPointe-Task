import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";


const generateAccess = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    return {
      success:true,
      accessToken
    };
  } catch (error) {
    return {
      success: false,
      message:
        "Something went wrong while generating referesh and access token",
    };
  }
};

const registerUser = asyncHandler(async (req, res) => {
    try {
      let {
        firstName,
        lastName,
        email,
        password,
        gender,
        phone,
        role
      } = req.body;
  
      // let profileImage;
  
      firstName =
        firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      lastName =
        lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
  
      // if (req.file) {
      //   const file = req.file;
  
      //   await uploadFile(file.buffer, email, file.mimetype, "usersProfile");
      //   profileImage = email;
      // }
  
      const emailUser = await User.findOne({ email });
      const existedUser = await User.findOne({ phone });
      if (existedUser ) {
        return res.status(409).json({
          success: false,
          error: `User with same ${phone} already exist`,
        });
      }
      if (emailUser ) {
        return res.status(409).json({
          success: false,
          error: `User with same ${email} already exist`,
        });
      }
  
      const fullName = firstName + " " + lastName;
  
      const userData = {
        fullName,
        firstName,
        lastName,
        email,
        password,
        gender,
        phone,
        role,
      };
  
  
      await User.create(userData);
      
      
      return res.status(201).json({
        success:true,
        message: "User registered successfully",
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        // Mongoose validation error, extract error messages
        const validationErrors = {};
        for (const key in error.errors) {
          validationErrors[key] = error.errors[key].message;
        }
  
        return res.status(400).json({
          success:false,
          errors: validationErrors,
        });
      }
  
      console.log(error);
      return res.status(500).json({
        success:false,
        error: "Internal Server Error",
      });
    }
});

const loginUser = asyncHandler(async (req, res) => {
const { email, password } = req.body;

if (!email) {
    return res.status(400).json({
    success: false,
    error: "Email is required",
    });
}
if (!password) {
    return res.status(400).json({
    success: false,
    error: "Password is required",
    });
}

const user = await User.findOne({ email });

if (!user) {
    return res.status(400).json({
    success: false,
    error: "User does not exist",
    });
}

const isPasswordValid = await user.isPasswordCorrect(password);

if (!isPasswordValid) {
    return res.status(401).json({
    success: false,
    error: "Invalid user credentials",
    });
}

const {success, accessToken} = await generateAccess(
  user._id
);

if (!success){
  return res.status(400).json({
    success: false,
    error:
      "Something went wrong while generating referesh and access token",
  })
}

const loggedInUser = await User.findById(user._id).select(
    "-password"
);

return res.status(200).json({
    success: true,
    message: "User logged In Successfully",
    user: loggedInUser,
    accessToken,
});
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user.toObject();
  
    return res.status(200).json({
      success: true,
      user,
      message: "User fetched successfully",
    });
});
  

const getAllUser = asyncHandler(async (req, res) => {
try {
    const fullName = req.query.fullName;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const query = fullName
    ? { fullName: { $regex: new RegExp(fullName, "i") } }
    : {};

    const totalUsers = await User.countDocuments(query);

    const totalPages = Math.ceil(totalUsers / pageSize);
    const skip = (page - 1) * pageSize;
    let users = await User.find(query)
    .sort({_id:-1})
    .skip(skip)
    .limit(pageSize)
    .select("-password -refreshToken");

    

    if (!users) {
    return res.status(200).json({
        success:false,
        error: "Something went wrong",
    });
    }

    

    return res.status(200).json({
    success: true,
    users: users,
    totalUsers: totalUsers,
    totalPages: totalPages,
    currentPage: page,
    pageSize: pageSize,
    });
} catch (error) {
    return res.status(500).json({
    success: false,
    error: "Internal Server Error",
    });
}
});

const updateUser = asyncHandler(async (req, res) => {
    try {
      const details = req.body;
  
      const userData = await User.findById(details._id);
  
      let profileImage;
  
      if (!userData) {
        return res.status(404).json({
          status: 404,
          error: "User not found",
        });
      }
  
      // Check if firstName or lastName has changed
      if (req.file) {
        const file = req.file;
  
        await uploadFile(file.buffer, userData.email, file.mimetype, "usersProfile");
        profileImage = userData.email;
      }
  
      if (details.firstName && details.firstName !== userData.firstName) {
        details.fullName = `${details.firstName} ${userData.lastName}`;
      }
      if (details.lastName && details.lastName !== userData.lastName) {
        details.fullName = `${userData.firstName} ${details.lastName}`;
      }
      if (details.firstName && details.lastName) {
        details.fullName = `${details.firstName} ${details.lastName}`;
      }
  
      if (profileImage) {
        details.profileImage = profileImage;
      }
  
      const user = await User.findByIdAndUpdate(details._id, details, {
        new: true,
        runValidators: true,
      });
  
      if (!user) {
        return res.status(404).json({
          status: 404,
          error: "User not found",
        });
      }
  
      return res.status(200).json({
        status: 200,
        message: "User details updated successfully",
        applicant: user,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        
        const validationErrors = {};
        for (const key in error.errors) {
          validationErrors[key] = error.errors[key].message;
        }
  
        return res.status(400).json({
          status: 400,
          errors: validationErrors,
        });
      }
      return res.status(500).json({
        status: 500,
        error: "Internal Server Error",
      });
    }
});



export {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUser,
  updateUser
}