import dotenv from "dotenv";

dotenv.config();

export const env = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    CLIENT_URL: process.env.CLIENT_URL,

    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,

    SESSION_SECRET: process.env.SESSION_SECRET,
    SESSION_MAX_AGE: Number(process.env.SESSION_MAX_AGE),

    RABBITMQ_URL: process.env.RABBITMQ_URL,

    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: Number(process.env.SMTP_PORT),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,

    LOG_LEVEL: process.env.LOG_LEVEL,
};
