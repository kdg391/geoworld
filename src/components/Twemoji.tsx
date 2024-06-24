const toCodePoint = (str: string) => {
    const r = []

    for (const s of str) {
        const c = s.codePointAt(0) as number

        r.push(c.toString(16))
    }

    return r.join('-')
}

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

    return (
        <img
            src={`https://cdnjs.cloudflare.com/ajax/libs/twemoji/15.1.0/svg/${code}.svg`}
            {...props}
        />
    )
}

export default Twemoji
