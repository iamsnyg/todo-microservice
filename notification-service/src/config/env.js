import dotenv from "dotenv";

dotenv.config();

export const env = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,

    RABBITMQ_URL: process.env.RABBITMQ_URL,

    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: Number(process.env.SMTP_PORT),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,

    MAIL_FROM: process.env.MAIL_FROM,
    DATABASE_URL: process.env.DATABASE_URL,
};
