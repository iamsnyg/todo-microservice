import amqp from "amqplib";

const connection = await amqp.connect("amqp://localhost");
const channel = await connection.createChannel();

await channel.assertExchange("notification.exchange", "topic", {
    durable: true,
});

const message = {
    type: "user.registered",
    email: "bunnywork6497@gmail.com",
    name: "Sunny",
};

channel.publish(
    "notification.exchange",
    "user.registered",
    Buffer.from(JSON.stringify(message)),
    { persistent: true },
);

console.log("Message published.");

setTimeout(() => connection.close(), 500);
