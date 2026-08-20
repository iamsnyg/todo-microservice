import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import { RedisStore } from "connect-redis";

import redis from "./config/redis.js";
import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
    }),
);

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

<<<<<<< HEAD
console.log("SESSION_SECRET =", env.SESSION_SECRET);
=======
>>>>>>> 616da95 (Add Todo microservices DevOps configuration)

app.use(
    session({
        store: new RedisStore({
            client: redis,
        }),
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: env.SESSION_MAX_AGE,
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        },
    }),
);

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Auth Service Running",
    });
});

app.use((req, res, next) => {
    console.log("AUTH SERVICE RECEIVED:", req.method, req.originalUrl);
    next();
});

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

export default app;
