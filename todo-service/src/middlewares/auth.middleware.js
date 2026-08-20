import { env } from "../config/env.js";

export function authenticate(req, res, next) {
    const gatewaySecret = req.headers["x-gateway-secret"];

    if (gatewaySecret !== env.GATEWAY_SECRET) {
        return res.status(403).json({
            success: false,
            message: "Forbidden",
        });
    }

    const userId = req.headers["x-user-id"];

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    req.user = {
        id: userId,
        email: req.headers["x-user-email"],
        role: req.headers["x-user-role"],
    };

    next();
}
