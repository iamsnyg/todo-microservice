import { getChannel } from "../config/rabbitmq.js";
import { createNotificationQueue } from "../services/rabbitmq.service.js";
import { handleNotification } from "../services/notification.service.js";

export async function startConsumer() {
    const channel = getChannel();

    const queue = await createNotificationQueue();

    console.log("👂 Waiting for messages...");

    channel.consume(queue, async (message) => {
        if (!message) return;

        try {
            const event = JSON.parse(message.content.toString());
            console.log("📥 Received Event:", event);
            await handleNotification(event);

            channel.ack(message);
        } catch (error) {
            console.error(error);

            channel.nack(message, false, false);
        }
    });
}
