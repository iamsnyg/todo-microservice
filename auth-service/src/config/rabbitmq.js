import amqp from "amqplib";
import { env } from "../config/env.js";

let connection;
let channel;

export async function connectRabbitMQ() {
    connection = await amqp.connect(env.RABBITMQ_URL);

    channel = await connection.createChannel();

    await channel.assertExchange("notification.exchange", "topic", {
        durable: true,
    });

    console.log("✅ RabbitMQ Connected");
}

export function getChannel() {
    return channel;
}
