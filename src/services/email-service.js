import sendgrid from 'sendgrid'
import config from '../config.js'

const sendgridClient = sendgrid(config.sendgridKey)

export const send = async (to, subject, body) => {
  sendgridClient.send({
    to,
    from: 'hello@balta.io',
    subject,
    html: body,
  })
}
