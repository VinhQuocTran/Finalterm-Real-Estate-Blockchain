const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const { htmlToText } = require('html-to-text');

class Email {
    constructor(user, url) {
        this.to = user.email;
        this.from = "Tran Minh Tri " + process.env.EMAIL_FROM;
        this.url = url;
        this.name = user.username;
    }

    // Generate different transport for different emails.
    newTransport() {
        if (process.env.NODE_ENV === "production") {
            // Send Gmail
            return nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.PROD_EMAIL_USERNAME,
                    password: process.env.PROD_EMAIL_PASSWORD,
                },
            });
        }

        // Send Mailtrap        
        return nodemailer.createTransport({
            host: process.env.DEV_EMAIL_HOST,
            port: process.env.DEV_EMAIL_PORT,
            auth: {
                user: process.env.DEV_EMAIL_USERNAME,
                pass: process.env.DEV_EMAIL_PASSWORD,
            },
        });
    }

    // Send the actual email
    async send(template, subject) {
        // Render HTML based on a EJS template
        const file = path.join(__dirname, `../views/${template}.ejs`);
        console.log('----- TEST -----');
        console.log(file);
        console.log('----- TEST -----');
        const html = await ejs.renderFile(file, {
            name: this.name,
            url: this.url,
        });

        // Define mail options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html),
        };

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendPasswordReset() {
        await this.send(
            "passwordReset",
            "Your password reset token (valid for only 10 minutes)"
        );
    }
}

module.exports = Email;