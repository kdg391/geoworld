import { useContext } from 'react'

import LocaleContext from '../contexts/LocaleContext.js'

const useLocale = () => useContext(LocaleContext)

export default useLocale
