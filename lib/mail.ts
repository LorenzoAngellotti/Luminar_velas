import nodemailer from "nodemailer";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // contraseña de app
    },
  });

  const verifyUrl = `${BASE_URL}/api/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: `Luminar Velas <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirmá tu cuenta",
    html: `
      <h2>Bienvenido/a</h2>
      <p>Hacé clic para verificar tu cuenta:</p>
      <a href="${verifyUrl}" 
         style="padding:10px 15px; background:#2563eb; color:#fff; border-radius:5px; text-decoration:none;">
         Verificar cuenta
      </a>
      <br><br>
      <p>O copiá este link:</p>
      <p>${verifyUrl}</p>
    `,
  });
}
