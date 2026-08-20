import app from "./app.js";
import { env } from "./config/env.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import { verifyMailConnection } from "./config/mail.js";
import { startConsumer } from "./consumers/notification.consumer.js";

async function startServer() {
    await connectRabbitMQ();

    await verifyMailConnection();

    await startConsumer();

    app.listen(env.PORT, () => {
        console.log(`🚀 Notification Service running on port ${env.PORT}`);
    });
}

startServer();
