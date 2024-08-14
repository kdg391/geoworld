import styles from './Loading.module.css'

import Spinner from '@/components/common/Spinner/index.js'

const Loading = () => (
  <div className={styles.container}>
    <div>
      <Spinner size={36} />
    </div>
    <p>Loading...</p>
  </div>
)

export default Loading
