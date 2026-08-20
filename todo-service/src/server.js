import app from "./app.js";
import { env } from "./config/env.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";

async function startServer() {
    await connectRabbitMQ();

    app.listen(env.PORT, () => {
        console.log(`🚀 Todo Service running on port ${env.PORT}`);
    });
}

startServer();
