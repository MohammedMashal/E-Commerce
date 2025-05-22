const nodemailer = require("nodemailer");

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.url = url;
		this.firstName = user.name.split(" ")[0];
		this.from = `${process.env.NAME_FROM} <${process.env.EMAIL_FROM}>`;
	}

	newTransport() {
		if (process.env.NODE_ENV === "production") {
			return nodemailer.createTransport({
				service: "SendGrid",
				auth: {
					user: process.env.SENDGRID_USERNAME,
					pass: process.env.SENDGRID_PASSWORD,
				},
			});
		}
		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	//sending the actual email
	async send(subject, text) {
		//defining mail options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			text,
		};
		//create transport and send email
		await this.newTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send(
			"Welcome to our family",
			`Hi ${this.firstName},\nWelcome to our family, we're glad to have you 🎉🙏\nWe're all a big family here.\nIf you want to check your information please click this link ${this.url}`
		);
	}

	async sendResetPassword() {
		await this.send(
			"Your password reset url (valid for only 10 minutes)",
			`Hi ${this.firstName},\nForgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${this.url}`
		);
	}
};
