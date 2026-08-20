import { getChannel } from "../config/rabbitmq.js";

export async function publishUserRegistered(user) {
    const channel = getChannel();

    const event = {
        type: "user.registered",
        email: user.email,
        name: user.name,
    };

    channel.publish(
        "notification.exchange",
        "user.registered",
        Buffer.from(JSON.stringify(event)),
        {
            persistent: true,
        },
    );

    console.log("📨 user.registered event published");
}
