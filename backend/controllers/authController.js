const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc   Register a new user (patient or doctor)
// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const {
      name, email, password, role, phone,
      dateOfBirth, gender,
      specialization, experienceYears, consultationFee,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === "doctor" ? "doctor" : "patient",
      phone,
      dateOfBirth,
      gender,
      specialization,
      experienceYears,
      consultationFee,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialization: user.specialization,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get logged-in user's profile
// @route  GET /api/auth/profile
// @access Private
const getProfile = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, getProfile };
