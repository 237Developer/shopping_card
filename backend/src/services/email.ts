import "dotenv/config";
import nodemailer from "nodemailer";
import { orderMessages, OrderStatus } from "./orderMessages";

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

export async function sendOrderStatusEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string | number,
  status: OrderStatus,
): Promise<void> {
  const content = orderMessages[status];
  if (!content) return; // no message planned for this status: send nothing

  const subject = content.subject.replace("{orderNumber}", String(orderNumber));

  await transporter.sendMail({
    from: `"NyangaMarket" <${emailUser}>`,
    to: customerEmail,
    subject,
    text: `Bonjour ${customerName},\n\n${content.message}\n\nCommande n°${orderNumber}\n\nL'équipe NyangaMarket`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #16a34a; margin-top: 0;">NyangaMarket</h2>
        <h3>${content.title}</h3>
        <p>Bonjour <strong>${customerName}</strong>,</p>
        <p>${content.message}</p>
        <p style="background: #f0fdf4; padding: 12px; border-radius: 6px;">
          Commande n°<strong>${orderNumber}</strong>
        </p>
        <p>Cordialement,<br>L'équipe NyangaMarket</p>
      </div>
    `,
  });

  console.log("email sent");
}
