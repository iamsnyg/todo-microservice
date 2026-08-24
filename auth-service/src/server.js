import app from "./app.js";
import { env } from "./config/env.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";

const PORT = env.PORT || 5000;

async function startServer() {
    await connectRabbitMQ();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Auth Service running on ${PORT}`);
    });
}

startServer();
