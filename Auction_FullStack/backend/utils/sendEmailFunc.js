import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            connectionTimeout: 10000,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Auction Space" <${process.env.SMTP_MAIL}>`,
            to: email,
            subject,
            text: message,
        };

        if (html) {
            mailOptions.html = html;
        }

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info?.messageId || "OK");
        return { success: true, info };
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
};

export { sendEmail };