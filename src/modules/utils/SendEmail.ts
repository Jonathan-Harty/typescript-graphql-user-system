import nodemailer from 'nodemailer';

export const sendEmail = async (email: string, url: string) => {
  const account = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  const emailOptions = {
    from: '"Fred Foo" <foo@example.com>',
    to: email,
    subject: 'Hello',
    text: 'Hello world?',
    html: `<a href=${url}>Confirm Email at ${url}</a>`,
  };

  const info = await transporter.sendMail(emailOptions);

  console.log(`Message sent: ${info.messageId}`);
  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
};
