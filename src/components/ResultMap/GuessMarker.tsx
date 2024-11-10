import { UserRound } from 'lucide-react'

import styles from './GuessMarker.module.css'

import './GuessMarker.css'

const GuessMarker = () => (
  <div className={styles.marker}>
    <div className={styles['guess-marker']}>
      <UserRound size={16} />
    </div>
  </div>
)

export default GuessMarker
