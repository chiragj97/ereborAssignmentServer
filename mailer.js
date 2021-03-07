const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const sendEmail = (user) => {
  console.log('us', user);
  const mailOptions = {
    from: process.env.GMAIL_ID,
    to: process.env.GMAIL_ID,
    subject: 'Activate your account',
    html: `
            <h3>Hello ${user.name}</h3>
            <p>Thank you registering into our application.</p>
            <p>To activate you account please follow this link:<a target="_" href="${process.env.DOMAIN}/user/activate/${user._id}">Click here to activate your account</a></p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendEmail;
