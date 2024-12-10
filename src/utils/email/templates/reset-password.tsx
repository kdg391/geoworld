import {
  Body,
  Button,
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
  resetPasswordLink: string
}

const baseUrl = process.env.NEXT_PUBLIC_URL as string

export const ResetPasswordTemplate = ({ resetPasswordLink }: Props) => (
  <Html>
    <Head />
    <Preview>Reset your password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src={`${baseUrl}/assets/light.svg`}
            width="124"
            height="24"
            alt="GeoWorld"
          />
        </Section>
        <Heading style={h1}>Reset your password</Heading>
        <Text style={heroText}>
          To reset your password, click the button below.
        </Text>

        <Button
          style={{
            backgroundColor: '#007ee6',
            borderRadius: '4px',
            color: '#fff',
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            fontSize: '15px',
            textDecoration: 'none',
            textAlign: 'center' as const,
            display: 'block',
            width: '200px',
            padding: '14px 7px',
          }}
          href={resetPasswordLink}
        >
          Reset Password
        </Button>

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

export default ResetPasswordTemplate

const footerLink = {
  color: '#b7b7b7',
  textDecoration: 'underline',
}

const main = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
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

const text = {
  color: '#000',
  fontSize: '14px',
  lineHeight: '24px',
}
