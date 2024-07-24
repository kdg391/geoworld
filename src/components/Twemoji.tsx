import Image from 'next/image'

import { toCodePoint } from '../utils/index.js'

interface Props {
  emoji: string
  width: number
  height: number
  alt: string
}

const Twemoji = ({ emoji, width, height, alt }: Props) => {
  const code = toCodePoint(emoji)

  return (
    <Image
      src={`/assets/flags/${code}.svg`}
      alt={alt}
      width={width}
      height={height}
    />
  )
}

export default Twemoji
