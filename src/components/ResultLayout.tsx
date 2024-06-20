import styles from './ResultLayout.module.css'

interface Props {
    round: number
    rounds: number
}

const ResultLayout: React.FC<Props> = () => {
    return <div className={styles.layout}></div>
}

export default ResultLayout
