import { useEffect, useState } from 'react'

const useClickOutside = (
  ref: React.MutableRefObject<HTMLElement | null>,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as HTMLElement) &&
        isOpen
      ) {
        setIsOpen((o) => !o)
      }
    }

    window.addEventListener('click', onClick)

    return () => window.removeEventListener('click', onClick)
  }, [isOpen])

  return [isOpen, setIsOpen]
}

export default useClickOutside
