import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import notificationRoutes from "./routes/notification.routes.js";
import { publishEvent } from "./services/producer.service.js";

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    }),
);
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
    res.json({
        success: true,
        service: "Notification Service",
    });
});

app.use("/api/notifications", notificationRoutes);``
app.post("/test", async (req, res) => {
    await publishEvent("user.registered", {
        type: "user.registered",
        name: "Suraj",
        email: "your-email@gmail.com",
    });

    res.json({
        success: true,
        message: "Event Published",
    });
});

export default app;
