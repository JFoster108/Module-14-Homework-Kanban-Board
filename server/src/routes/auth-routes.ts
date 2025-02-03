import express from "express";
import { login, logout } from "../controllers/user-controller";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

export default router;
