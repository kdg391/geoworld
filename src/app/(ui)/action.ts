'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { createGame } from '@/actions/game.js'
import { getMap } from '@/actions/map.js'

import { OFFICIAL_MAP_WORLD_ID } from '@/constants/index.js'

const schema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해 주세요.')
    .max(20, '이름이 너무 깁니다.')
    .trim(),
})

export const playGame = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await schema.safeParseAsync({
    name: formData.get('name'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const { data: mapData } = await getMap(OFFICIAL_MAP_WORLD_ID)
  const { data: gameData, error } = await createGame({
    mapData,
    settings: {
      canMove: true,
      canPan: true,
      canZoom: true,
      rounds: 5,
      timeLimit: 120,
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
