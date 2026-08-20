import nodemailer from "nodemailer";
import { env } from "./env.js";

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

export async function verifyMailConnection() {
    try {
        await transporter.verify();
        console.log("✅ SMTP Connected");
    } catch (error) {
        console.error("❌ SMTP Connection Failed");
        console.error(error);
        process.exit(1);
    }
}

export default transporter;
