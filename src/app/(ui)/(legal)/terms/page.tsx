import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import styles from '../page.module.css'

export const revalidate = 86400

const Terms = async () => {
  const content = await fetch(
    'https://raw.githubusercontent.com/kdg391/geoworld/main/docs/terms-of-service.md',
  ).then((res) => res.text())

  return (
    <main className={styles.content}>
      <Markdown rehypePlugins={[[rehypeRaw]]}>{content}</Markdown>
    </main>
  )
}

export default Terms
