'use server'

export const getUser = async (id: string) => {
  const { data, error } = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/users/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json())

  return {
    data,
    error: error?.message ?? null,
  }
}
