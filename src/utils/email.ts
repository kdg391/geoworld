import 'server-only'

import { createTranslation } from '@/i18n/server.js'

import type { Theme } from '@auth/core/types'

interface HTMLOptions {
  host: string
  theme: Theme
  url: string
}

export async function html({ host, theme, url }: HTMLOptions) {
  const escapedHost = host.replace(/\./g, '&#8203;.')

  const brandColor = theme.brandColor ?? '#346df1'
  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText ?? '#fff',
  }

  const { t } = await createTranslation('auth')

  return `<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px; font-size: 24px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
              <a href="${url}" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">
                ${t('sign_in')}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email, you can safely ignore it.
      </td>
    </tr>
  </table>
</body>`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
interface TextOptions {
  host: string
  url: string
}

export async function text({ host, url }: TextOptions) {
  return `Sign in to ${host}\n${url}\n\n`
}
