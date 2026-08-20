import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
<<<<<<< HEAD
import { createProxyMiddleware } from "http-proxy-middleware";
import compression from "compression";
=======
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import compression from "compression";
import hpp from "hpp";

>>>>>>> 616da95 (Add Todo microservices DevOps configuration)
import { env } from "./config/env.js";
import { authenticate } from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import { requestId } from "./middlewares/requestId.middleware.js";
import { requestLogger } from "./middlewares/logger.middleware.js";

<<<<<<< HEAD
import hpp from "hpp";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);
=======
const app = express();

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.disable("x-powered-by");

app.set("trust proxy", 1);

>>>>>>> 616da95 (Add Todo microservices DevOps configuration)
app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
    }),
);

app.use(helmet());
<<<<<<< HEAD
app.use(hpp());
app.use(compression());
app.use(morgan("dev"));
// app.use(
//     express.json({
//         limit: "10kb",
//     }),
// );
=======

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
>>>>>>> 616da95 (Add Todo microservices DevOps configuration)

app.use(
    express.urlencoded({
        extended: true,
        limit: "10kb",
    }),
);
<<<<<<< HEAD
app.use(apiLimiter);
app.use(requestId);
app.use(requestLogger);
// app.use(requestTimeout);
// app.use(haltOnTimedout);
=======

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
>>>>>>> 616da95 (Add Todo microservices DevOps configuration)

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API Gateway is running",
    });
});

/*
|--------------------------------------------------------------------------
<<<<<<< HEAD
| Auth Service (Public Routes)
=======
| Auth Service
|--------------------------------------------------------------------------
| Public routes
>>>>>>> 616da95 (Add Todo microservices DevOps configuration)
|--------------------------------------------------------------------------
*/

app.use(
    "/api/auth",
    createProxyMiddleware({
        target: env.AUTH_SERVICE_URL,
        changeOrigin: true,
<<<<<<< HEAD
        pathRewrite: (path) => "/api/auth" + path,

        on: {
            error(err, req, res) {
                console.error("Auth Service Error:", err.message);

                res.status(503).json({
                    success: false,
                    message: "Auth Service Unavailable",
                });
=======

        pathRewrite: (path) => "/api/auth" + path,

        on: {
            proxyReq(proxyReq, req) {
                /*
                 * express.json() has already consumed the body.
                 * fixRequestBody() puts the parsed body back
                 * into the proxied request.
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
>>>>>>> 616da95 (Add Todo microservices DevOps configuration)
            },
        },
    }),
);

/*
|--------------------------------------------------------------------------
<<<<<<< HEAD
| Todo Service (Protected Routes)
=======
| Todo Service
|--------------------------------------------------------------------------
| Protected routes
>>>>>>> 616da95 (Add Todo microservices DevOps configuration)
|--------------------------------------------------------------------------
*/

app.use("/api/todos", authenticate);

app.use(
    "/api/todos",
    createProxyMiddleware({
        target: env.TODO_SERVICE_URL,
        changeOrigin: true,

<<<<<<< HEAD
        proxyTimeout: 10000, // 10 seconds
        timeout: 10000, // 10 seconds
=======
        proxyTimeout: 10000,
        timeout: 10000,
>>>>>>> 616da95 (Add Todo microservices DevOps configuration)

        pathRewrite: (path) => "/api/todos" + path,

        on: {
            proxyReq(proxyReq, req) {
<<<<<<< HEAD
                if (req.user) {
                    proxyReq.setHeader("x-user-id", req.user.id);
                    proxyReq.setHeader("x-user-email", req.user.email);
                    proxyReq.setHeader("x-user-role", req.user.role);
                    proxyReq.setHeader("x-gateway-secret", env.GATEWAY_SECRET);
                    proxyReq.setHeader("x-request-id", req.requestId);
                }
            },

            error(err, req, res) {
=======
                /*
                 * IMPORTANT:
                 * Set custom headers BEFORE fixRequestBody().
                 */

                if (req.user) {
                    proxyReq.setHeader("x-user-id", req.user.id);

                    proxyReq.setHeader("x-user-email", req.user.email);

                    proxyReq.setHeader("x-user-role", req.user.role);

                    proxyReq.setHeader("x-gateway-secret", env.GATEWAY_SECRET);

                    proxyReq.setHeader("x-request-id", req.requestId);
                }

                /*
                 * Forward the parsed JSON body.
                 */
                fixRequestBody(proxyReq, req);
            },

            error(err, req, res) {
                console.error("Todo Service Error:", err.message);

>>>>>>> 616da95 (Add Todo microservices DevOps configuration)
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
<<<<<<< HEAD
=======

>>>>>>> 616da95 (Add Todo microservices DevOps configuration)
/*
|--------------------------------------------------------------------------
| Notification Service
|--------------------------------------------------------------------------
<<<<<<< HEAD
*/

/*
|--------------------------------------------------------------------------
| Notification Service (Protected Routes)
=======
| Protected routes
>>>>>>> 616da95 (Add Todo microservices DevOps configuration)
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
<<<<<<< HEAD
                if (req.user) {
                    proxyReq.setHeader("x-user-id", req.user.id);
                    proxyReq.setHeader("x-user-email", req.user.email);
                    proxyReq.setHeader("x-user-role", req.user.role);
                    proxyReq.setHeader(
                        "x-gateway-secret",
                        env.GATEWAY_SECRET
                    );
                    proxyReq.setHeader(
                        "x-request-id",
                        req.requestId
                    );
                }
            },

            error(err, req, res) {
=======
                /*
                 * Set custom headers BEFORE fixRequestBody().
                 */

                if (req.user) {
                    proxyReq.setHeader("x-user-id", req.user.id);

                    proxyReq.setHeader("x-user-email", req.user.email);

                    proxyReq.setHeader("x-user-role", req.user.role);

                    proxyReq.setHeader("x-gateway-secret", env.GATEWAY_SECRET);

                    proxyReq.setHeader("x-request-id", req.requestId);
                }

                /*
                 * Forward the parsed JSON body.
                 */
                fixRequestBody(proxyReq, req);
            },

            error(err, req, res) {
                console.error("Notification Service Error:", err.message);

>>>>>>> 616da95 (Add Todo microservices DevOps configuration)
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

<<<<<<< HEAD
app.use(errorHandler);
=======
/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

>>>>>>> 616da95 (Add Todo microservices DevOps configuration)
export default app;
