import * as authService from "../services/auth.service.js";

export async function register(req, res, next) {
    try {
        const user = await authService.register(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const user = await authService.login(req, req.body);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

export async function logout(req, res, next) {
    try {
        await authService.logout(req);

        res.clearCookie("connect.sid");

        res.json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
}

export async function me(req, res, next) {
    try {
        const user = authService.getCurrentUser(req);

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
}
