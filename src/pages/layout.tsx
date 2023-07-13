import { Source_Sans_3 } from 'next/font/google'

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
});

const Layout = ({ children }: { children: React.ReactNode }) =>(
  <html lang="en" className={sourceSans.className}>
    <body>{children}</body>
  </html>
);

export default Layout;
