'use client'

import Spinner from '@/components/common/Spinner/index.tsx'

import styles from './loading.module.css'

const Loading = () => (
  <div className={styles.container}>
    <div>
      <Spinner size={36} />
    </div>
    <p className="mt-2">Loading...</p>
  </div>
)

export default Loading
