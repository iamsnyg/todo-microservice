import amqp from "amqplib";
import { env } from "./env.js";

<<<<<<< HEAD
let connection;
let channel;

export async function connectRabbitMQ() {
    try {
        connection = await amqp.connect(env.RABBITMQ_URL);

        channel = await connection.createChannel();

        await channel.assertExchange("notification.exchange", "topic", {
            durable: true,
        });

        console.log("✅ RabbitMQ Connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
=======
let connection = null;
let channel = null;
let reconnecting = false;

const EXCHANGE_NAME = "notification.exchange";

export async function connectRabbitMQ() {
    if (reconnecting) {
        return;
    }

    reconnecting = true;

    try {
        console.log("🔄 Connecting to RabbitMQ...");

        const newConnection = await amqp.connect(env.RABBITMQ_URL);

        const newChannel = await newConnection.createChannel();

        await newChannel.assertExchange(EXCHANGE_NAME, "topic", {
            durable: true,
        });

        connection = newConnection;
        channel = newChannel;

        console.log("✅ RabbitMQ connection established");
        console.log("✅ RabbitMQ channel created");
        console.log(`✅ Exchange "${EXCHANGE_NAME}" ready`);

        // Connection error
        connection.on("error", (error) => {
            console.error("❌ RabbitMQ connection error:", error.message);
        });

        // Connection closed
        connection.on("close", () => {
            console.error("⚠️ RabbitMQ connection closed");

            connection = null;
            channel = null;
            reconnecting = false;

            setTimeout(() => {
                connectRabbitMQ();
            }, 5000);
        });

        // Channel error
        channel.on("error", (error) => {
            console.error("❌ RabbitMQ channel error:", error.message);
        });

        // Channel closed
        channel.on("close", () => {
            console.error("⚠️ RabbitMQ channel closed");

            channel = null;
        });

        reconnecting = false;
    } catch (error) {
        console.error("❌ RabbitMQ connection failed:", error.message);

        connection = null;
        channel = null;
        reconnecting = false;

        console.log("⏳ RabbitMQ will reconnect in 5 seconds...");

        setTimeout(() => {
            connectRabbitMQ();
        }, 5000);
>>>>>>> 616da95 (Add Todo microservices DevOps configuration)
    }
}

export function getChannel() {
    return channel;
}
