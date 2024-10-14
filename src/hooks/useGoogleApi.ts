import { useContext } from 'react'

import GoogleApiContext, {
  type ContextValue,
} from '../contexts/GoogleApiContext.js'

const useGoogleApi = () =>
  useContext(GoogleApiContext) ??
  ({
    isLoaded: false,
    loadGoogleApi() {},
  } as ContextValue)

export default useGoogleApi
