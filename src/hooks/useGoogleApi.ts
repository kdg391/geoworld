import { useContext } from 'react'

import GoogleApiContext, {
  type ContextValue,
} from '../contexts/GoogleApiContext.js'

const useGoogleApi = () =>
  useContext(GoogleApiContext) ??
  ({
    isGoogleApiLoaded: false,
    loadGoogleApi() {},
  } as ContextValue)

export default useGoogleApi
