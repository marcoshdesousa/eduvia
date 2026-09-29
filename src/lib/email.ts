import nodemailer from "nodemailer";

let transport: ReturnType<typeof nodemailer.createTransport> | null = null;

/** Envia e-mail via SMTP (SMTP_URL). Sem SMTP configurado, imprime no console (desenvolvimento). */
export async function sendMail(msg: { to: string; subject: string; text: string }) {
  if (!process.env.SMTP_URL) {
    console.log(`\n📧 [e-mail simulado] Para: ${msg.to}\nAssunto: ${msg.subject}\n${msg.text}\n`);
    return;
  }
  transport ??= nodemailer.createTransport(process.env.SMTP_URL);
  await transport.sendMail({ from: process.env.MAIL_FROM || "Eduvia <nao-responda@eduvia.app>", ...msg });
}
