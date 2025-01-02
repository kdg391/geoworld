import {
  Gamepad,
  Laptop,
  Smartphone,
  TabletSmartphone,
  TvMinimal,
} from 'lucide-react'
import { UAParser } from 'ua-parser-js'

import { formatRelativeTime } from '@/utils/index.js'

import SignOutSessionForm from './SignOutSessionForm.js'

import type { Session } from '@/lib/session.js'
import { getLocale } from '@/i18n/server.js'

interface Props {
  session: Session
}

const SessionItem = async ({ session }: Props) => {
  const parsedUA = session.userAgent
    ? new UAParser(session.userAgent).getResult()
    : null

  const locale = await getLocale()

  const relativeTime = formatRelativeTime(session.createdAt, locale)

  return (
    <div>
      {parsedUA && (
        <div
          style={{
            display: 'flex',
          }}
        >
          {parsedUA.device.type === 'mobile' ? (
            <Smartphone size={16} />
          ) : parsedUA.device.type === 'tablet' ? (
            <TabletSmartphone size={16} />
          ) : parsedUA.device.type === 'console' ? (
            <Gamepad size={16} />
          ) : parsedUA.device.type === 'smarttv' ? (
            <TvMinimal size={16} />
          ) : (
            <Laptop size={16} />
          )}
          <div>{`${parsedUA.browser.name}, ${parsedUA.os.name}`}</div>
        </div>
      )}
      <div>{relativeTime}</div>

      <SignOutSessionForm sessionId={session.id} />
    </div>
  )
}

export default SessionItem
