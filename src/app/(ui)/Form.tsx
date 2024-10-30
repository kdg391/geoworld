'use client'

import { Play } from 'lucide-react'
import { useActionState, useState } from 'react'

import { playGame } from './action.js'

import SubmitButton from '@/components/common/SubmitButton/index.js'
import TextInput from '@/components/common/TextInput/index.js'

import styles from './Form.module.css'

interface FormState {
  errors: {
    name?: string[]
    message?: string
  } | null
}

const Form = () => {
  'use client'

  const [isLoading, setIsLoading] = useState(false)

  const onPlayButtonClick = async (_: unknown, formData: FormData) => {
    'use client'

    setIsLoading(true)

    const state = await playGame(null, formData)
    setIsLoading(false)

    return state
  }

  const [state, action] = useActionState<FormState, FormData>(
    onPlayButtonClick,
    {
      errors: null,
    },
  )

  return (
    <form action={action} className={styles.form}>
      <div>
        <TextInput id="name" name="name" minLength={1} maxLength={20} />
      </div>

      <p className={styles.desc}>예시: 21001 홍길동</p>

      <div>
        <SubmitButton isLoading={isLoading} variant="primary" size="m">
          <Play size={16} fill="var(--color)" />
          플레이
        </SubmitButton>
      </div>

      <div>
        {state.errors?.name &&
          state.errors.name.map((msg, index) => (
            <p key={index} className={styles.error}>
              {msg}
            </p>
          ))}
        {state.errors?.message && (
          <p className={styles.error}>{state.errors.message}</p>
        )}
      </div>
    </form>
  )
}

export default Form
