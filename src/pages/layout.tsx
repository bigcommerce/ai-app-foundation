import { Source_Sans_3 } from 'next/font/google'

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
});

const Layout = ({ children }: { children: React.ReactNode }) =>(
  <main className={sourceSans.className}>
    {children}
  </main>
);

export default Layout;
