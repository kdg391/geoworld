'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { createGame } from '@/actions/game.ts'
import { getMap } from '@/actions/map.ts'

const schema = z.object({
  name: z
    .string()
    .min(5, '학번과 이름은 5글자 이상이어야 합니다.')
    .max(12, '학번과 이름은 12글자 이하여야 합니다.')
    .trim(),
  mapId: z.uuid(),
})

export const playGame = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await schema.safeParseAsync({
    name: formData.get('name'),
    mapId: formData.get('map-id'),
  })

  if (!validated.success)
    return {
      errors: z.flattenError(validated.error).fieldErrors,
    }

  const { data: mapData } = await getMap(validated.data.mapId)
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
