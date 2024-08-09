import nodemailer from 'nodemailer';
import winston from 'winston';
import dotenv from "dotenv";
dotenv.config();

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
});

const sendMail = async (to: string, subject: string, html: string) => {
    const from: string = process.env.SERVER_EMAIL || '';
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_HOST,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: html
    };

    logger.info(`Sending mail to - ${to}`);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.error(error);
        } else {
            logger.info('Email sent: ' + info.response);
        }
    });
}


const generateHTMLEmail = (title: string, message: string) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        /* Your CSS styles here */
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>${message}</p>
    </body>
    </html>`

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendMailUserConfirm = async (user: any) => {
    const title = 'CONFIRME SUA CONTA'
    const message = `Clice <a href="${process.env.APP_URL}/api/user/confirm/${user.id}">aqui</a> para confirmar sua conta`
    sendMail(user.email, title, generateHTMLEmail(title, message))
}