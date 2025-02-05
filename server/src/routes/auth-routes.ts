import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
dotenv.config();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username , password } = req.body;

    const user : User | null = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).json({ message: 'Invalid username' });
      return;
    }

    const isPasswordValid : boolean = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }

    const token : string = jwt.sign(
      { id: user.id, username: user.username},
      process.env.JWT_SECRET_TOKEN as string,
      { expiresIn: '15m' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Something went wrong'});
  }
};

const router: Router = Router();

router.post('/login', login);

export default router;