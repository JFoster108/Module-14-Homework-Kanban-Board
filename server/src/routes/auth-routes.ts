import {Router, Request, Response} from "express";
import {User} from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req : Request, res : Response) => {
  const {username,password} = req.body;

  const user = await User.findOne({
    where: {username},
  });
  if (!user){
    return res.status(401).json({message:"authentication failed"});
  }
}










const router = Router();
router.post("/login", login);

export default router;
