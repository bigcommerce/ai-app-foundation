import { Analytics } from '@vercel/analytics/react';
import { Source_Sans_3 } from 'next/font/google';
import { type Metadata } from 'next/types';
import StyledComponentsRegistry from '~/lib/registry';
import ThemeProvider from './theme-provider';
import Script from 'next/script';
import * as snippet from '@segment/snippet';
import { env } from '~/env.mjs';
import { useAppContext } from '~/context/AppContext';

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
});

export const metadata: Metadata = { title: 'BigAI Copywriter' };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loadSegment = () => {
    const opts = { apiKey: env.NEXT_PUBLIC_SEGMENT_WRITE_KEY };

    if (process.env.NODE_ENV === 'development') {
      return snippet.max(opts);
    }

    return snippet.min(opts);
  };

  const { storeHash } = useAppContext();
  const frameAncestors = [
    `https://store-${storeHash}.mybigcommerce.com`,
    `https://store-${storeHash}.my-staging.com`,
    `https://store-${storeHash}.my-integration.com`
  ];

  return (
    <html lang="en">
      <head>
      <meta
        http-equiv="Content-Security-Policy"
        frame-ancestors={frameAncestors} />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <main className={sourceSans.className}>{children}</main>
          </ThemeProvider>
        </StyledComponentsRegistry>
        <Script
          dangerouslySetInnerHTML={{ __html: loadSegment() }}
          id="segment-script"
        />
        <Analytics />
      </body>
    </html>
  );
}
