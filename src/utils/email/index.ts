import 'server-only'

import { render } from '@react-email/render'
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({})

interface MailOptions {
  from: string
  to: string
  subject: string
  text: string
  html: React.ReactNode
}

export const sendEmail = async (mailOptions: MailOptions) => {
  const html = await render(mailOptions.html)

  const messageInfo = await transporter.sendMail({
    ...mailOptions,
    html,
  })

  return messageInfo
}
