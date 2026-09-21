import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message, html }) => {
    try {
        const mailUser = process.env.SMTP_MAIL;
        const mailPass = process.env.SMTP_PASSWORD;

        if (!mailUser || !mailPass) {
            throw new Error("SMTP_MAIL or SMTP_PASSWORD environment variable is missing.");
        }

        // Configure transport with Gmail service preference or custom host
        const transportOptions = process.env.SMTP_SERVICE
            ? {
                service: process.env.SMTP_SERVICE,
                auth: {
                    user: mailUser,
                    pass: mailPass,
                },
              }
            : {
                host: process.env.SMTP_HOST || "smtp.gmail.com",
                port: Number(process.env.SMTP_PORT) || 465,
                secure: Number(process.env.SMTP_PORT) === 465,
                auth: {
                    user: mailUser,
                    pass: mailPass,
                },
              };

        const transporter = nodemailer.createTransport(transportOptions);

        const mailOptions = {
            from: `"Auction Space" <${mailUser}>`,
            to: email,
            subject,
            text: message,
        };

        if (html) {
            mailOptions.html = html;
        }

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to:", email, "MessageId:", info?.messageId || "OK");
        return { success: true, info };
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
};

export { sendEmail };