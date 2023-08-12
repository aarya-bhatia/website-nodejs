const nodemailer = require("nodemailer");

module.exports.sendEmail = async (address, subject, content) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const options = () => {
      return {
        from: process.env.EMAIL_ADDRESS,
        to: address,
        subject: subject,
        text: content
      };
    };

    const doc = await transporter.sendMail(options());
    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Failed to send email.", err);
  }
}
