'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { createGame } from '@/actions/game.ts'
import { getMap } from '@/actions/map.ts'
import { OFFICIAL_MAP_WORLD_ID } from '@/constants/index.ts'

const schema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해 주세요.')
    .max(12, '이름은 12자 이하로 입력해 주세요.')
    .trim(),
})

export const playGame = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await schema.safeParseAsync({
    name: formData.get('name'),
  })

  if (!validated.success)
    return {
      errors: z.flattenError(validated.error).fieldErrors,
    }

  const { data: mapData } = await getMap(OFFICIAL_MAP_WORLD_ID)
  const { data: gameData, error } = await createGame({
    mapData,
    settings: {
      canMove: true,
      canPan: true,
      canZoom: true,
      rounds: 5,
      timeLimit: 90,
    },
    name: validated.data.name,
  })

  if (!gameData || error)
    return {
      errors: {
        message: '게임을 시작하는 데 오류가 발생했습니다.',
      },
    }

  redirect(`/game/${gameData.id}`)
}
