import { toCodePoint } from '../utils/index.js'

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
    const code = toCodePoint(emoji)

    return <img src={`/geoworld/assets/flags/${code}.svg`} {...props} />
}

export default Twemoji
