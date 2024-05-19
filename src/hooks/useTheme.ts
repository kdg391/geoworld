import { useContext } from 'react'

import ThemeContext from '../contexts/ThemeContext.js'

const useTheme = () => useContext(ThemeContext)

export default useTheme
