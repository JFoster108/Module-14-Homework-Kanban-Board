import { Request, Response } from "express";
import jwt from "jsonwebtoken"; // ✅ Fix: Import JWT correctly
import bcrypt from "bcryptjs";   // ✅ Fix: Import bcrypt correctly
import dotenv from "dotenv";
import { User } from "../models/user";

dotenv.config();

const generateToken = (userId: number): string => {
  const secretKey = process.env.JWT_SECRET;
  
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    { id: userId },
    secretKey, // ✅ Ensure secret key is defined
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } // ✅ Fix option placement
  );
};


export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // ✅ Check if user exists
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ message: "Invalid username or password" });

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid username or password" });

    // ✅ Generate JWT token
    const token = generateToken(user.id);

    // ✅ Store JWT in httpOnly cookie
    res.cookie("jwt", token, {
      httpOnly: true, // Prevents client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    return res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// GET /Users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /Users/:id
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /Users
export const createUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const newUser = await User.create({ username, password });
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /Users/:id
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    const user = await User.findByPk(id);
    if (user) {
      user.username = username;
      user.password = password;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("jwt");
  return res.json({ message: "Logged out successfully" });
};

// DELETE /Users/:id
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
