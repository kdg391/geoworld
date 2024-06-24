import { useContext } from 'react'

import SettingsContext, {
    type ContextValue,
} from '../contexts/SettingsContext.js'

const useSettings = () =>
    useContext(SettingsContext) ??
    ({ distanceUnit: null, setDistanceUnit() {} } as ContextValue)

export default useSettings
