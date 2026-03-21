import nodemailer from 'nodemailer';

const MAIL_HOST = process.env.MAIL_SERVER || 'smtp.gmail.com';
const MAIL_PORT = Number(process.env.SMTP_PORT) || 587;
const MAIL_USER = process.env.USER_NAME || '';
const MAIL_PASSWORD = process.env.PASSWORD || '';
const MAIL_FROM = process.env.EMAIL || 'noreply@example.com';

// Only log in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Email configuration:', {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USER: MAIL_USER ? '***' : '',
    MAIL_PASSWORD: MAIL_PASSWORD ? '***' : '',
    MAIL_FROM,
  });
}

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: MAIL_PORT === 465,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
} as any);

const sendMail = async (
  html: string,
  subject: string,
  receiver: string
): Promise<string | false> => {
  // Skip sending if no email credentials configured
  if (!MAIL_USER || !MAIL_PASSWORD) {
    console.log('Email skipped: No credentials configured');
    return false;
  }

  try {
    const mail = {
      from: `"Elizabeth Mende Brown" <${MAIL_FROM}>`,
      to: receiver,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mail);
    console.log('Message sent: %s', info.messageId);
    return info.messageId;
  } catch (err) {
    console.error(`Error sending mail to ${receiver}:`, err);
    return false;
  }
};

export default sendMail;
