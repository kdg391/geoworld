import Markdown from 'react-markdown'

const PrivacyPolicy = async () => {
  const content = await fetch(
    'https://raw.githubusercontent.com/kdg391/geoworld/main/privacy-policy.md',
    {
      next: {
        tags: ['privacy'],
      },
    },
  ).then((res) => res.text())

  return (
    <main>
      <section>
        <Markdown
          components={{
            br: () => <br />,
          }}
        >
          {content}
        </Markdown>
      </section>
    </main>
  )
}

export default PrivacyPolicy
