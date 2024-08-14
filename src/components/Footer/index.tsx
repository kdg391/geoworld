'use server'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'

import { createTranslation } from '@/i18n/server.js'

import styles from './index.module.css'
import './index.css'

const GitHub = dynamic(() => import('../icons/GitHub.js'))
const LanguageSelect = dynamic(() => import('../LanguageSelect/index.js'))
const ThemeSelect = dynamic(() => import('../ThemeSelect/index.js'), {
  ssr: false,
})

const Footer = async () => {
  const { t } = await createTranslation('translation')

  return (
    <footer className={styles.footer}>
      <div>
        <div>
          <Image
            src="/assets/icons/icon.svg"
            width={18}
            height={18}
            alt="Logo"
          />
          GeoWorld
        </div>
        <div className={styles.settings}>
          <div className={styles['social-links']}>
            <a
              href="https://github.com/kdg391/geoworld"
              target="_blank"
              rel="noreferrer noopener"
              className={styles['github-link']}
              title="GitHub"
            >
              <GitHub size={18} />
            </a>
          </div>
          <div>
            <ThemeSelect />
          </div>
          <div>
            <LanguageSelect />
          </div>
        </div>
      </div>
      <div>
        <h4>Links</h4>
        <ul className={styles.links}>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/random">{t('randomStreetView')}</Link>
          </li>
        </ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul className={styles.links}>
          <li>
            <Link href="/terms">{t('termsOfService')}</Link>
          </li>
          <li>
            <Link href="/privacy">{t('privacyPolicy')}</Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
