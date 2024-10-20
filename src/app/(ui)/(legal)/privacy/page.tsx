import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import styles from '../page.module.css'

export const revalidate = 86400

const Privacy = async () => {
  const content = await fetch(
    'https://raw.githubusercontent.com/kdg391/geoworld/main/docs/privacy-policy.md',
  ).then((res) => res.text())

  return (
    <main className={styles.content}>
      <Markdown rehypePlugins={[[rehypeRaw]]}>{content}</Markdown>
    </main>
  )
}

export default Privacy
