import { createContext } from 'react'

export interface ContextValue {
  isGoogleApiLoaded: boolean
  loadGoogleApi: () => Promise<void>
}

const GoogleApiContext = createContext<ContextValue | null>(null)

export default GoogleApiContext
