import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT,

    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,

    TODO_SERVICE_URL: process.env.TODO_SERVICE_URL,

    NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL,

    GATEWAY_SECRET: process.env.GATEWAY_SECRET,

    CLIENT_URL: process.env.CLIENT_URL,
};
