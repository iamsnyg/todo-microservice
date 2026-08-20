import { getChannel } from "../config/rabbitmq.js";

export async function publishEvent(routingKey, event) {
    const channel = getChannel();

    channel.publish(
        "notification.exchange",
        routingKey,
        Buffer.from(JSON.stringify(event)),
        {
            persistent: true,
        },
    );

    console.log(`📤 Event Published: ${routingKey}`);
}
