import { useContext } from 'react'

import SettingsContext from '../contexts/SettingsContext.js'

const useSettings = () => useContext(SettingsContext)

export default useSettings
