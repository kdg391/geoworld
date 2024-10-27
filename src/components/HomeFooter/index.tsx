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
  const { t } = useTranslation('common')

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className="flex">
            <Image
              src="/assets/light.svg"
              width={124}
              height={24}
              alt="GeoWorld Logo"
              className="dark-hidden"
            />
            <Image
              src="/assets/dark.svg"
              width={124}
              height={24}
              alt="GeoWorld Logo"
              className="light-hidden"
            />
          </div>
          <div className={styles['social-links']}>
            <a
              href="https://github.com/kdg391/geoworld"
              target="_blank"
              rel="noreferrer noopener"
              className={styles['github-link']}
              title="GitHub"
            >
              <GitHub size={20} />
            </a>
          </div>
        </div>
        <div className={styles['footer-nav']}>
          <div className={styles['footer-nav-container']}>
            <div>
              <h2 className={styles['link-title']}>Legal</h2>
              <ul className={styles.links}>
                <li>
                  <Link href="/terms">{t('terms_of_service')}</Link>
                </li>
                <li>
                  <Link href="/privacy">{t('privacy_policy')}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className={styles['link-title']}>Explore</h2>
              <ul className={styles.links}>
                <li>
                  <Link href="/maps">Classic Maps</Link>
                </li>
                <li>
                  <Link href="/daily-challenge">Daily Challenge</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className={styles['link-title']}>Developers</h2>
              <ul className={styles.links}>
                <li>
                  <Link href="/docs">Docs</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className={styles['link-title']}>GeoWorld</h2>
              <ul className={styles.links}>
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/random">Random</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={styles['settings-container']}>
        <div>GeoWorld</div>
        <div className={styles.settings}>
          <div>
            <LanguageSelect />
          </div>
          <div>
            <ThemeSelect />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default HomeFooter
