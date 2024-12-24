import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface Props {
  validationCode?: string
}

const baseUrl = process.env.NEXT_PUBLIC_URL as string

export const VerifyEmailTemplate = ({ validationCode }: Props) => (
  <Html>
    <Preview>Verify your email address</Preview>
    <Head>
      <meta name="color-scheme" content="light dark" />
      <meta name="supported-color-schemes" content="light dark" />
      <style>
        {`.dark-mode-hide {
  display: block;
}

.dark-mode-show {
  display: none;
}

@media (prefers-color-scheme: dark) {
  .dark-mode-hide {
    display: none !important;
  }

  .dark-mode-show {
    display: block !important;
  }
}`}
      </style>
    </Head>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src={`${baseUrl}/assets/light.png`}
            width="124"
            height="24"
            alt="GeoWorld"
            className="dark-mode-hide"
          />
          <Img
            src={`${baseUrl}/assets/dark.png`}
            width="124"
            height="24"
            alt="GeoWorld"
            className="dark-mode-show"
          />
        </Section>
        <Heading style={h1}>Verify your email address</Heading>
        <Text style={heroText}>
          {
            "Your verification code is below - enter it in your open browser window and we'll help you get signed in."
          }
        </Text>

        <Section style={codeBox}>
          <Text style={verificationCodeText}>{validationCode}</Text>
        </Section>

        <Text style={text}>
          {
            "If you didn't request this email, there's nothing to worry about, you can safely ignore it."
          }
        </Text>

        <Section>
          <Link
            style={footerLink}
            href={`${baseUrl}/terms`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link
            style={footerLink}
            href={`${baseUrl}/privacy`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </Link>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default VerifyEmailTemplate

const footerLink = {
  color: '#b7b7b7',
  textDecoration: 'underline',
}

const main = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
}

const container = {
  margin: '0 auto',
  padding: '0px 20px',
}

const logoContainer = {
  marginTop: '32px',
}

const h1 = {
  color: '#1d1c1d',
  fontSize: '36px',
  fontWeight: '700',
  margin: '30px 0',
  padding: '0',
  lineHeight: '42px',
}

const heroText = {
  fontSize: '20px',
  lineHeight: '28px',
  marginBottom: '30px',
}

const codeBox = {
  background: 'rgb(245, 244, 245)',
  borderRadius: '4px',
  marginBottom: '30px',
  padding: '40px 10px',
}

const verificationCodeText = {
  fontSize: '30px',
  textAlign: 'center' as const,
  verticalAlign: 'middle',
}

const text = {
  color: '#000',
  fontSize: '14px',
  lineHeight: '24px',
}
