import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken} from "../config/token.js";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password
    if (!validator.isLength(password, { min: 8 })) {
      return res.status(400).json({ message: "Password must be at least 8 characters long enter strong password" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "",
        maxAge: 6 * 24 * 60 * 60 * 1000 // 6 days
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Internal server error" });
  }

};

export const login = async (req, res) => {
  try{
    const { email, password } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    let token = await genToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure:false,
      sameSite: "",
      maxAge: 6 * 24 * 60 * 60 * 1000 // 6 days
    });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });


  }
};
export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const googlelogin=async (req,res)=>{
  try{
    let {email,name}=req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name });
      await user.save();
    }
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 6 * 24 * 60 * 60 * 1000 // 6 days
    });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in googlelogin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


