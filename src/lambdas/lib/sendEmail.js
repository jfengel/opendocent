const nodemailer = require('nodemailer');

const sendEmail = (from, to, subject, text) => {
  return new Promise((success, failure) => {
    let transporter = nodemailer.createTransport({
      service: 'SendInBlue', // no need to set host or port etc.
      auth: {
        user: 'catchall@purgo.net',
        pass: process.env.SENDINBLUE_SECRET
      }});

    transporter.sendMail({
      from,
      to,
      subject,
      text
    }, function(error, info) {
      if (error) {
        failure(error);
      } else {
        success(info);
      }
    });
  })
}
exports.sendEmail = sendEmail;
