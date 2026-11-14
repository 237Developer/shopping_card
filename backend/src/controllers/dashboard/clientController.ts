import { Request, Response } from "express";
import {
  getTotalClients,
  getNewClientsThisMonth,
  getActiveClients,
} from "../../database/queries/dashboard/client/clientStats";
import { getPaginatedClientsList } from "../../database/queries/dashboard/client/paginatedClients";
import { sendEmail } from "../../services/dashboard/mailer";

export async function getClientStatsFullController(
  _req: Request,
  res: Response,
) {
  try {
    const totalClients = await getTotalClients();
    const newClients = await getNewClientsThisMonth();
    const activeClients = await getActiveClients();

    res.json({
      totalClients,
      newClients,
      activeClients,
    });
  } catch (error) {
    console.error("Error fetching client full stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getPaginatedClientsController(
  req: Request,
  res: Response,
) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 8;
    const filter = req.query.filter as string | undefined;
    const search = req.query.search as string | undefined;

    const result = await getPaginatedClientsList({
      page,
      limit,
      filter,
      search,
    });
    res.json(result);
  } catch (error) {
    console.error("Error fetching paginated clients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function sendClientMessageController(req: Request, res: Response) {
  try {
    const { to, subject, message } = req.body as {
      to: string;
      subject: string;
      message: string;
    };

    if (!to || !subject || !message) {
      return res
        .status(400)
        .json({ error: "Destinataire, objet et message requis" });
    }

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #0475FE; margin-top: 0;">NyangaMarket</h2>
        <h3 style="color: #1e293b;">${subject}</h3>
        <p style="color: #334155; line-height: 1.5; white-space: pre-wrap;">${message}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">Cordialement,<br>L'équipe NyangaMarket</p>
      </div>
    `;

    await sendEmail({
      to,
      subject,
      htmlBody,
    });

    res.json({ success: true, message: "Email envoyé avec succès" });
  } catch (error) {
    console.error("Error sending client message email:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
  }
}
