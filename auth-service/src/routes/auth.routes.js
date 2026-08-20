import express from "express";
import { registerSchema } from "../validations/register.schema.js";
import { login, logout, me, register } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validations/login.schema.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/logout", isAuthenticated, logout);

router.get("/me", isAuthenticated, me);

export default router;
