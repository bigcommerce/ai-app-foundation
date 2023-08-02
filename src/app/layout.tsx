
import { Source_Sans_3 } from 'next/font/google'
import { type Metadata } from 'next/types';
import StyledComponentsRegistry from '~/lib/registry';
import ThemeProvider from './theme-provider';

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
});

export const metadata: Metadata = { title: 'Product description generator' };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={sourceSans.className}>
      <head>
        <link rel="icon" href="/magic.svg" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
