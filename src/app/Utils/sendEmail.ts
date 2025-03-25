import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // FIXED: Added quotes
    port: 587,
    secure: false, // `false` for 587, `true` for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, resetLink: string) => {
  try {
    await transporter.sendMail({
      from: `"Chapters & Co." <${process.env.SMTP_USER}>`,
      to,
      subject: "Password Reset Request",
      text: `Click the link below to reset your password:\n${resetLink}`,
      html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a>`,
    });

    return { success: true, message: "Reset email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send reset email" };
  }
};
