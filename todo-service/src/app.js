import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import todoRoutes from "./routes/todo.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
// import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Todo Service is running",
    });
});

app.use((req, res, next) => {
    console.log(
        `[${req.headers["x-request-id"]}] ${req.method} ${req.originalUrl}`,
    );

    next();
});

app.use("/api/todos", todoRoutes);
// app.use("/api/todos", dashboardRoutes);
app.use(errorHandler);

export default app;
