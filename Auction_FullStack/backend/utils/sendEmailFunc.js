import nodemailer from 'nodemailer';

const sendEmail=async({email,subject,message})=>{
    const transported=nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const options={
        from: process.env.EMAIL_FROM,
        to: email,
        subject,
        text: message
    };

    await transported.sendEmail(options);
}
export {sendEmail}