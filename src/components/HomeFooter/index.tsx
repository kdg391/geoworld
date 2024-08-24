'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'

import { useTranslation } from '@/i18n/client.js'

import styles from './index.module.css'
import './index.css'

const GitHub = dynamic(() => import('../icons/GitHub.js'))
const LanguageSelect = dynamic(() => import('../LanguageSelect/index.js'))
const ThemeSelect = dynamic(() => import('../ThemeSelect/index.js'), {
  ssr: false,
})

const HomeFooter = () => {
  const { t } = useTranslation('translation')

  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <div className={styles.title}>
          <Image
            src="/assets/icons/icon.svg"
            width={24}
            height={24}
            alt="Logo"
          />
          GeoWorld
        </div>
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
        <div className={styles.settings}>
          <div>
            <ThemeSelect />
          </div>
          <div>
            <LanguageSelect />
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div>
          <h4>Links</h4>
          <ul className={styles.links}>
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
        <div>
          <h4>Docs</h4>
        </div>
        <div>
          <h4>Test</h4>
        </div>
      </div>
    </footer>
  )
}

export default HomeFooter
