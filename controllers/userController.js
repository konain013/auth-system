const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("../validators/authValidator");

const registerUser = async (req, res) => {
  try {
    //1.Validation(zod)
    // safeParse() — req.body ko Zod schema ke rules se validate karta hai
    // success:true → result.data | success:false → result.error.errors
    const result = registerSchema.safeParse(req.body);

    //console.log(result.error.issues[0]);

    if (!result.success) {
      const error = result.error.issues[0];
      if (error.code === "invalid_type" && error.input === undefined) {
        return res.status(400).json({
          success: false,
          message: `${error.path[0]} is required`,
        });
      }
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
      });
    }

    let { name, email, password } = result.data; //save valid and sanitize data

    //2.check if user already Exist
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({
        success: false,
        message: "user already exist",
      });
    }
    //3. Formatted Name
    const formattedName = name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // 4. hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //5.create user

    const user = await User.create({
      name: formattedName,
      email,
      password: hashedPassword,
    });

    //6.response
    return res.status(201).json({
      success: true,
      message: "user register succesfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success:false, message: "Internal Server Error" });
  }
};

// ****************
//  LOGIN
// ****************

const loginUser = async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);

    //1.Validation
    if (!result.success) {
      const error = result.error.issues[0];
      if (error.code === "invalid_type" && error.input === undefined) {
        return res.status(400).json({
          success: false,
          message: `${error.path[0]} is required`,
        });
      }
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
      });
    }
    const { email, password } = result.data;

    //2.find user by email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //3.comparing password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    //4.JWT

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    //5.reponse
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

//  ****************

//  Get all user

//  ****************

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      message: "user fetched sucessfully",
      count: users.length,
      users: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "internal Server error",
    });
  }
};

// *******************************

// Get Single User

// ********************************

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User fetch successfully",
      user: user,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

// ***********************

// DELETE A USER

// ***********************

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

module.exports = {
  registerUser,
  getUsers,
  getUserById,
  loginUser,
  deleteUser,
};
