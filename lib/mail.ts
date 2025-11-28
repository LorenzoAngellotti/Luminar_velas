// /lib/mail.ts

import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Falta RESEND_API_KEY en las variables de entorno");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  try {
    const res = await resend.emails.send({
      from: "Luminar Velas <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("Email enviado:", res);
    return res;
  } catch (error) {
    console.error("Error al enviar email:", error);
    return null;
  }
}
