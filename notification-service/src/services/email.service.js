import transporter from "../config/mail.js";
import { env } from "../config/env.js";

export async function sendEmail({ to, subject, html }) {
    await transporter.sendMail({
        from: env.MAIL_FROM,
        to,
        subject,
        html,
    });

    console.log(`📧 Email sent to ${to}`);
}
