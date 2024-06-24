import { useContext } from 'react'

import ThemeContext, { type ContextValue } from '../contexts/ThemeContext.js'

const useTheme = () =>
    useContext(ThemeContext) ?? ({ setTheme() {}, theme: null } as ContextValue)

export default useTheme
