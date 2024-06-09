import twemoji from 'twemoji'

import type React from 'react'

interface Props {
    emoji: string
}

const Twemoji: React.FC<
    Props &
        React.DetailedHTMLProps<
            React.ImgHTMLAttributes<HTMLImageElement>,
            HTMLImageElement
        >
> = ({ emoji, ...props }) => {
    const code = twemoji.convert.toCodePoint(emoji)

    return (
        <img
            src={`https://cdnjs.cloudflare.com/ajax/libs/twemoji/15.1.0/svg/${code}.svg`}
            {...props}
        />
    )
}

export default Twemoji
