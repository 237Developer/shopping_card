import "dotenv/config";
import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  throw new Error("EMAIL_USER and EMAIL_PASS must be defined in the .env file");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  htmlBody: string;
}

export async function sendEmail({
  to,
  subject,
  htmlBody,
}: SendEmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"ShopEasy" <${emailUser}>`,
      to,
      subject,
      html: htmlBody,
    });
    console.log(`Email successfully sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
}
