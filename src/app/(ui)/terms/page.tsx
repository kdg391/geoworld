import Markdown from 'react-markdown'

const TermsOfService = async () => {
  const content = await fetch(
    'https://raw.githubusercontent.com/kdg391/geoworld/main/terms-of-service.md',
    {
      next: {
        tags: ['terms'],
      },
    },
  ).then((res) => res.text())

  return (
    <main>
      <section>
        <Markdown>{content}</Markdown>
      </section>
    </main>
  )
}

export default TermsOfService
