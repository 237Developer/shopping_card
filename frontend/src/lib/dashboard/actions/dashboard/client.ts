"use server";

import { revalidatePath } from "next/cache";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api/dashboard";

export async function sendClientMessageAction({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) {
  try {
    const response = await fetch(`${API_URL}/clients/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, message }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to send message: ${response.statusText}`);
    }

    revalidatePath("/dashboard/clients");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error in sendClientMessageAction:", error);
    const msg = error instanceof Error ? error.message : "Erreur lors de l'envoi du message";
    return { success: false, error: msg };
  }
}
