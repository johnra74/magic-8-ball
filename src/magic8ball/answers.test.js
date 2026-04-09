import { describe, it, expect } from 'vitest'
import { ANSWERS, getRandomAnswer, getAnswersByType } from './answers'

describe('Magic 8-Ball answers', () => {
  it('contains exactly 20 answers', () => {
    expect(ANSWERS).toHaveLength(20)
  })

  it('every answer has a text and a type', () => {
    ANSWERS.forEach((answer) => {
      expect(answer).toHaveProperty('text')
      expect(answer).toHaveProperty('type')
      expect(answer.text.length).toBeGreaterThan(0)
    })
  })

  it('contains exactly 10 positive answers', () => {
    expect(getAnswersByType('positive')).toHaveLength(10)
  })

  it('contains exactly 5 neutral answers', () => {
    expect(getAnswersByType('neutral')).toHaveLength(5)
  })

  it('contains exactly 5 negative answers', () => {
    expect(getAnswersByType('negative')).toHaveLength(5)
  })

  it('getRandomAnswer returns an answer from the list', () => {
    const answer = getRandomAnswer()
    expect(ANSWERS).toContainEqual(answer)
  })

  it('getRandomAnswer returns different answers over many calls', () => {
    const results = new Set(Array.from({ length: 50 }, () => getRandomAnswer().text))
    expect(results.size).toBeGreaterThan(1)
  })
})
