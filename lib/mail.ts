// /lib/mail.ts

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to: string, link: string) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY no configurada");
    return null;
  }

  try {
    const result = await resend.emails.send({
      from: "Luminar Velas <no-reply@luminarvelas.com>",
      to,
      subject: "Recuperación de contraseña",
      html: `
        <p>Hacé clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${link}">${link}</a>
      `,
    });

    return result;
  } catch (err) {
    console.error("Error enviando email:", err);
    return null;
  }
}


