import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import {generateToken} from '../utils/jwt.js'
import UserModel from "../models/UserModel.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role,managerId } = req.body;

    const loggedInUser = req.user;
    console.log(loggedInUser)
    if(loggedInUser.role === "sales"){
      return res.status(403).json({message:"Sales cannot create users"})
    }

      if(!loggedInUser.role === "manager" && role !== sales){
      return res.status(403).json({message:"Manager can create only sales users"})
    }
    if(loggedInUser.role === 'admin' && 
      !["admin", "manager", "sales"].includes(role)
    ){
      return res.status(400).json({ message: "Invalid role" });
    }

  const UserExists = await UserModel.findOne({email});

    if (UserExists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
   let assignedManagerId = null;
   if(role === "sales"){
    if(loggedInUser === "manager"){
      assignedManagerId = loggedInUser._id;
    }else if(loggedInUser.role === "admin"){
       if (!managerId) {
          return res
            .status(400)
            .json({ message: "Manager is required for sales user" });
        }
        assignedManagerId = managerId;
    }
   }
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      createdBy:loggedInUser._id,
      managerId:assignedManagerId
    });

     res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
   
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ message: "Invalid Credentials,email not foun!" });

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched)
      return res
        .status(401)
        .json({ message: "Invalid Credentials,incorrect password!" });

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
