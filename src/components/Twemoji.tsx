import React from 'react'
import twemoji from 'twemoji'

interface Props {
    emoji: string
    width?: number
    height?: number
}

const Twemoji: React.FC<
    Props &
        React.DetailedHTMLProps<
            React.ImgHTMLAttributes<HTMLImageElement>,
            HTMLImageElement
        >
> = ({ emoji, width = 36, height = 36, ...props }) => {
    const code = twemoji.convert.toCodePoint(emoji)

    return (
        <img
            src={`https://cdnjs.cloudflare.com/ajax/libs/twemoji/15.1.0/svg/${code}.svg`}
            width={width}
            height={height}
            alt={emoji}
            {...props}
        />
    )
}

export default Twemoji
