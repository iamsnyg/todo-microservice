import amqp from "amqplib";
import { env } from "./env.js";

let connection;
let channel;

export async function connectRabbitMQ() {
    try {
        connection = await amqp.connect(env.RABBITMQ_URL);

        channel = await connection.createChannel();

        // Create Exchange
        await channel.assertExchange("notification.exchange", "topic", {
            durable: true,
        });

        console.log("✅ RabbitMQ Connected");

        return channel;
    } catch (error) {
        console.error("❌ RabbitMQ Connection Failed");
        console.error(error);
        process.exit(1);
    }
}

export function getChannel() {
    return channel;
}
