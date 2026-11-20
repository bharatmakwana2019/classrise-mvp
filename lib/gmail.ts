import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_SMTP_USER,
    pass: process.env.GMAIL_SMTP_APP_PASSWORD,
  },
});

export async function sendEmailOtp(to: string, otp: string) {
  await transporter.sendMail({
    from: `"${process.env.GMAIL_FROM_NAME ?? "gurukulOS"}" <${process.env.GMAIL_SMTP_USER}>`,
    to,
    subject: "Your gurukulOS verification code",
    text: `Your gurukulOS verification code is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px">
        <h2>Verify your email address</h2>
        <p>Use this code to continue setting up your institute:</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px">
          ${otp}
        </div>
        <p>This code expires in 10 minutes. Do not share it with anyone.</p>
      </div>
    `,
  });
}