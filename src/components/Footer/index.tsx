'use server'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { createTranslation } from '../../i18n/server.js'

import styles from './index.module.css'
import './index.css'

const DistanceUnitSelect = dynamic(() => import('./DistanceUnitSelect.js'), {
  ssr: false,
})
const GitHub = dynamic(() => import('../icons/GitHub.js'))
const LanguageSelect = dynamic(() => import('./LanguageSelect.js'))

const Footer = async () => {
  const { t } = await createTranslation('translation')

  return (
    <footer className={styles.footer}>
      <div>
        <h3>GeoWorld</h3>
        <div className={styles.settings}>
          <div style={{ display: 'none' }}>
            <DistanceUnitSelect />
          </div>
          <div>
            <LanguageSelect />
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
        </div>
      </div>
      <div>
        <h4>Links</h4>
        <ul className={styles.links}>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/location-picker">Location Picker</Link>
          </li>
          <li>
            <Link href="/random-streetview">Random Street View</Link>
          </li>
        </ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul className={styles.links}>
          <li>
            <Link href="/terms-of-service">{t('footer.termsOfService')}</Link>
          </li>
          <li>
            <Link href="/privacy-policy">{t('footer.privacyPolicy')}</Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
