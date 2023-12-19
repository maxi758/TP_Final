const nodemailer = require('nodemailer');
const HttpError = require('../models/http-error');
const dotenv = require('dotenv');

dotenv.config();

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject,
      text,
    };
    console.log(mailOptions);
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Error al enviar el mail, intente de nuevo más tarde',
      500
    );
    throw error;
  }
};

module.exports = sendEmail;
