import { createTranslation } from '../../i18n/server.js'

const NotFound = async () => {
  const { t } = await createTranslation('translation')

  return (
    <div>
      <h1>Map Not Found</h1>
    </div>
  )
}

export default NotFound
