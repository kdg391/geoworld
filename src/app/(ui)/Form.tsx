'use client'

import { Play } from 'lucide-react'
import { useActionState } from 'react'

import SubmitButton from '@/components/common/SubmitButton/index.tsx'
import TextInput from '@/components/common/TextInput/index.tsx'

import { playGame } from './action.ts'

import styles from './Form.module.css'
import Select from './select.tsx'

interface FormState {
  errors: {
    name?: string[]
    message?: string
  } | null
}

const Form = () => {
  'use client'

  const [state, action, isPending] = useActionState<FormState, FormData>(
    playGame,
    {
      errors: null,
    },
  )

  return (
    <form action={action} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          학번과 이름을 입력해 주세요.
        </label>
        <TextInput id="name" name="name" minLength={1} maxLength={20} />
      </div>

      <p className={styles.desc}>예시: 20101 홍길동</p>

      <div className={styles.settings}>
        <Select />

        <SubmitButton
          formAction={action}
          className={styles.play}
          leftIcon={<Play size={16} fill="#fff" stroke="#fff" />}
          size="m"
          variant="primary"
          isLoading={isPending}
          disabled={isPending}
        >
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
