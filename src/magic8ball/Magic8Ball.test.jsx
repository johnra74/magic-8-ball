import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Magic8Ball from './Magic8Ball'
import * as answers from './answers'

// ─── Helpers ──────────────────────────────────────────────────────────────────
//
// shakeDelay={0} injects a zero-ms animation window so we never have to
// advance fake timers.  This is a classic TDD dependency-injection pattern:
// make side-effects (time, randomness) injectable so tests control them.

function setup() {
  const user = userEvent.setup()
  render(<Magic8Ball shakeDelay={0} />)
  return { user }
}

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('Magic8Ball rendering', () => {
  it('renders a question input', () => {
    setup()
    expect(screen.getByRole('textbox', { name: /your question/i })).toBeInTheDocument()
  })

  it('renders an Ask button', () => {
    setup()
    expect(screen.getByRole('button', { name: /ask/i })).toBeInTheDocument()
  })

  it('displays the ball with the 8 by default', () => {
    setup()
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('disables the Ask button when the input is empty', () => {
    setup()
    expect(screen.getByRole('button', { name: /ask/i })).toBeDisabled()
  })
})

// ─── Interaction ──────────────────────────────────────────────────────────────

describe('Magic8Ball interaction', () => {
  beforeEach(() => {
    vi.spyOn(answers, 'getRandomAnswer').mockReturnValue({
      text: 'It is certain',
      type: 'positive',
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('enables the Ask button once a question is typed', async () => {
    const { user } = setup()
    await user.type(screen.getByRole('textbox'), 'Will I succeed?')
    expect(screen.getByRole('button', { name: /ask/i })).not.toBeDisabled()
  })

  it('shows the answer after shaking', async () => {
    const { user } = setup()
    await user.type(screen.getByRole('textbox'), 'Will I succeed?')
    await user.click(screen.getByRole('button', { name: /ask/i }))

    await waitFor(() => {
      expect(screen.getByText('It is certain')).toBeInTheDocument()
    })
  })

  it('submits when Enter is pressed in the input', async () => {
    const { user } = setup()
    await user.type(screen.getByRole('textbox'), 'Will I succeed?')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByText('It is certain')).toBeInTheDocument()
    })
  })

  it('does not call getRandomAnswer when question is blank', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: /ask/i }))
    expect(answers.getRandomAnswer).not.toHaveBeenCalled()
  })

  it('shows a positive verdict for a positive answer', async () => {
    const { user } = setup()
    await user.type(screen.getByRole('textbox'), 'Will I succeed?')
    await user.click(screen.getByRole('button', { name: /ask/i }))

    await waitFor(() => {
      expect(screen.getByText(/positive outlook/i)).toBeInTheDocument()
    })
  })

  it('shows a neutral verdict for a neutral answer', async () => {
    vi.spyOn(answers, 'getRandomAnswer').mockReturnValue({
      text: 'Ask again later',
      type: 'neutral',
    })

    const { user } = setup()
    await user.type(screen.getByRole('textbox'), 'Will I succeed?')
    await user.click(screen.getByRole('button', { name: /ask/i }))

    await waitFor(() => {
      expect(screen.getByText(/unclear/i)).toBeInTheDocument()
    })
  })

  it('shows a negative verdict for a negative answer', async () => {
    vi.spyOn(answers, 'getRandomAnswer').mockReturnValue({
      text: 'Very doubtful',
      type: 'negative',
    })

    const { user } = setup()
    await user.type(screen.getByRole('textbox'), 'Will I succeed?')
    await user.click(screen.getByRole('button', { name: /ask/i }))

    await waitFor(() => {
      expect(screen.getByText(/negative outlook/i)).toBeInTheDocument()
    })
  })
})
