import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import styles from '../page.module.css'

const TermsOfService = async () => {
  const content = await fetch(
    'https://raw.githubusercontent.com/kdg391/geoworld/main/terms-of-service.md',
    {
      next: {
        tags: ['terms'],
      },
    },
  ).then((res) => res.text())

  return (
    <main className={styles.content}>
      <Markdown rehypePlugins={[[rehypeRaw]]}>{content}</Markdown>
    </main>
  )
}

export default TermsOfService
