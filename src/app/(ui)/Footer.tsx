import ThemeSelect from '@/components/ThemeSelect/index.tsx'

import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <ThemeSelect />
    </footer>
  )
}

export default Footer
