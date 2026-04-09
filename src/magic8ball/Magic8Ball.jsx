import { useState } from 'react'
import { getRandomAnswer } from './answers'
import styles from './Magic8Ball.module.css'

export default function Magic8Ball({ shakeDelay = 700 }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [shaking, setShaking] = useState(false)

  function handleShake() {
    if (!question.trim()) return

    setShaking(true)
    setAnswer(null)

    setTimeout(() => {
      setAnswer(getRandomAnswer())
      setShaking(false)
    }, shakeDelay)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleShake()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputRow}>
        <input
          className={styles.questionInput}
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your question…"
          aria-label="Your question"
        />
        <button
          className={styles.askBtn}
          onClick={handleShake}
          disabled={!question.trim() || shaking}
          aria-label="Ask the Magic 8-Ball"
        >
          Ask
        </button>
      </div>

      <div
        className={`${styles.ball} ${shaking ? styles.shaking : ''}`}
        role="img"
        aria-label="Magic 8-Ball"
      >
        <div className={styles.innerCircle}>
          {shaking && <span className={styles.eight}>8</span>}
          {!shaking && answer && (
            <span
              className={`${styles.answerText} ${styles[answer.type]}`}
              role="status"
              aria-live="polite"
            >
              {answer.text}
            </span>
          )}
          {!shaking && !answer && <span className={styles.eight}>8</span>}
        </div>
      </div>

      {answer && !shaking && (
        <p className={`${styles.verdict} ${styles[answer.type]}`} role="status">
          {answer.type === 'positive' && '✓ Positive outlook'}
          {answer.type === 'neutral' && '? Unclear — ask again'}
          {answer.type === 'negative' && '✗ Negative outlook'}
        </p>
      )}
    </div>
  )
}
