import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import hpp from "hpp";
import {
    createProxyMiddleware,
    fixRequestBody,
} from "http-proxy-middleware";

import { env } from "./config/env.js";
import { authenticate } from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import { requestId } from "./middlewares/requestId.middleware.js";
import { requestLogger } from "./middlewares/logger.middleware.js";

const app = express();

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "x-request-id",
        ],
    }),
);

app.use(helmet());
app.use(hpp());

/*
|--------------------------------------------------------------------------
| Performance
|--------------------------------------------------------------------------
*/

app.use(compression());

/*
|--------------------------------------------------------------------------
| Logging
|--------------------------------------------------------------------------
*/

app.use(morgan("dev"));

/*
|--------------------------------------------------------------------------
| Body Parser
|--------------------------------------------------------------------------
*/

app.use(
    express.json({
        limit: "10kb",
    }),
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10kb",
    }),
);

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
*/

app.use(apiLimiter);
app.use(requestId);
app.use(requestLogger);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API Gateway is running",
    });
});

/*
|--------------------------------------------------------------------------
| Auth Service
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

app.use(
    "/api/auth",
    createProxyMiddleware({
        target: env.AUTH_SERVICE_URL,
        changeOrigin: true,

        pathRewrite: (path) => "/api/auth" + path,

        on: {
            proxyReq(proxyReq, req) {
                /*
                 * express.json() has already consumed the body.
                 * Restore the parsed body before proxying.
                 */
                fixRequestBody(proxyReq, req);
            },

            error(err, req, res) {
                console.error("Auth Service Error:", err.message);

                if (!res.headersSent) {
                    res.status(503).json({
                        success: false,
                        message: "Auth Service Unavailable",
                    });
                }
            },
        },
    }),
);

/*
|--------------------------------------------------------------------------
| Todo Service
|--------------------------------------------------------------------------
| Protected routes
|--------------------------------------------------------------------------
*/

app.use("/api/todos", authenticate);

app.use(
    "/api/todos",
    createProxyMiddleware({
        target: env.TODO_SERVICE_URL,
        changeOrigin: true,

        proxyTimeout: 10000,
        timeout: 10000,

        pathRewrite: (path) => "/api/todos" + path,

        on: {
            proxyReq(proxyReq, req) {
                /*
                 * Set authentication/user headers.
                 */
                if (req.user) {
                    proxyReq.setHeader("x-user-id", req.user.id);
                    proxyReq.setHeader("x-user-email", req.user.email);
                    proxyReq.setHeader("x-user-role", req.user.role);
                    proxyReq.setHeader(
                        "x-gateway-secret",
                        env.GATEWAY_SECRET,
                    );
                    proxyReq.setHeader(
                        "x-request-id",
                        req.requestId,
                    );
                }

                /*
                 * Forward the parsed JSON body.
                 */
                fixRequestBody(proxyReq, req);
            },

            error(err, req, res) {
                console.error("Todo Service Error:", err.message);

                if (!res.headersSent) {
                    res.status(504).json({
                        success: false,
                        message: "Gateway Timeout",
                    });
                }
            },
        },
    }),
);

/*
|--------------------------------------------------------------------------
| Notification Service
|--------------------------------------------------------------------------
| Protected routes
|--------------------------------------------------------------------------
*/

app.use("/api/notifications", authenticate);

app.use(
    "/api/notifications",
    createProxyMiddleware({
        target: env.NOTIFICATION_SERVICE_URL,
        changeOrigin: true,

        proxyTimeout: 10000,
        timeout: 10000,

        pathRewrite: (path) => "/api/notifications" + path,

        on: {
            proxyReq(proxyReq, req) {
                /*
                 * Set authentication/user headers.
                 */
                if (req.user) {
                    proxyReq.setHeader("x-user-id", req.user.id);
                    proxyReq.setHeader("x-user-email", req.user.email);
                    proxyReq.setHeader("x-user-role", req.user.role);
                    proxyReq.setHeader(
                        "x-gateway-secret",
                        env.GATEWAY_SECRET,
                    );
                    proxyReq.setHeader(
                        "x-request-id",
                        req.requestId,
                    );
                }

                /*
                 * Forward the parsed JSON body.
                 */
                fixRequestBody(proxyReq, req);
            },

            error(err, req, res) {
                console.error(
                    "Notification Service Error:",
                    err.message,
                );

                if (!res.headersSent) {
                    res.status(504).json({
                        success: false,
                        message: "Gateway Timeout",
                    });
                }
            },
        },
    }),
);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export default app;
