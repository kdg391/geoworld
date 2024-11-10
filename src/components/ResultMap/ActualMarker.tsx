import { Flag } from 'lucide-react'

import styles from './ActualMarker.module.css'

import './ActualMarker.css'

type Props = {
  isFinalResult: boolean
  roundNumber?: number
}

const ActualMarker = ({ roundNumber, isFinalResult }: Props) => (
  <div className={styles.marker}>
    <div className={styles['actual-marker']}>
      {isFinalResult ? roundNumber : <Flag size={16} />}
    </div>
  </div>
)

export default ActualMarker
