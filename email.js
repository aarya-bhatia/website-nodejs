const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");

module.exports.sendEmail = async (address, subject, payload, template) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const source = fs.readFileSync(template, "utf8");
    const compiledTemplate = ejs.compile(source);
    const options = () => {
      return {
        from: process.env.EMAIL_ADDRESS,
        to: address,
        subject: subject,
        text: compiledTemplate(payload)
      };
    };

    const doc = await transporter.sendMail(options());
    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Failed to send email.", err);
  }
}
