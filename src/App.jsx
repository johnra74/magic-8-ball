import Magic8Ball from './magic8ball/Magic8Ball'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Magic 8-Ball</h1>
      <p className={styles.hint}>Type a yes/no question and press <kbd>Ask</kbd> or <kbd>Enter</kbd>.</p>
      <Magic8Ball />
    </div>
  )
}
