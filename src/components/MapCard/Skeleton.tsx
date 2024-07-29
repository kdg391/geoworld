import styles from './index.module.css'
import './index.css'

const SkeletonMapCard = () => (
  <div className={styles['map-card']}>
    <div className={styles['map-thumbnail']}></div>
    <div className={styles['card-content']}></div>
  </div>
)

export default SkeletonMapCard
