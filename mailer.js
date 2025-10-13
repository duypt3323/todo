const nodemailer = require("nodemailer");

async function sendMail() {
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "32887e67d643c9",
      pass: "2d86100990c35c",
    },
  });

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
    subject: "Thư test từ Node.js ✔",
    text: "Đây là nội dung email test dạng text.",
    html: "<b>Đây là nội dung email test dạng HTML</b>",
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log("✅ Email đã gửi:", info.messageId);
  } catch (error) {
    console.error("❌ Lỗi khi gửi mail:", error);
  }
}

module.exports = sendMail;
