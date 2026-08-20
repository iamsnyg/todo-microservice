import { getChannel } from "../config/rabbitmq.js";

export async function createNotificationQueue() {
    const channel = getChannel();

    const queue = "notification.queue";

    await channel.assertQueue(queue, {
        durable: true,
    });

    await channel.bindQueue(queue, "notification.exchange", "#");

    return queue;
}
