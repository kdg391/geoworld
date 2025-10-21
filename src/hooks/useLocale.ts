import { useContext } from 'react'

import LocaleContext from '../contexts/LocaleContext.ts'

const useLocale = () => useContext(LocaleContext)

export default useLocale
