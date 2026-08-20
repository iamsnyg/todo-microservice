import axios from "axios";
import { env } from "../config/env.js";

export async function authenticate(req, res, next) {
    try {
        const cookie = req.headers.cookie;

        if (!cookie) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const response = await axios.get(
            `${env.AUTH_SERVICE_URL}/api/auth/me`,
            {
                headers: {
                    Cookie: cookie,
                },
                withCredentials: true,
            },
        );

        const user = response.data.data;

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
}
