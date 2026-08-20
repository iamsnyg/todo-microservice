import { getChannel } from "../config/rabbitmq.js";

export async function publishEvent(routingKey, message) {
    const channel = getChannel();

    if (!channel) {
        throw new Error("RabbitMQ channel is not initialized");
    }

    channel.publish(
        "notification.exchange",
        routingKey,
        Buffer.from(JSON.stringify(message)),
        {
            persistent: true,
        },
    );

    console.log(`📨 Event Published: ${routingKey}`);
}
