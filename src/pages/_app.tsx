import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { Box, GlobalStyles } from '@bigcommerce/big-design';
import { theme as defaultTheme } from '@bigcommerce/big-design-theme';
import { ThemeProvider } from 'styled-components';
import Head from "next/head";
import SessionProvider from '../../context/session';

import Layout from '~/pages/layout';

const MyApp: AppType = ({ Component, pageProps }) =>
  <Layout>
    <Head>
      <title>Control Panel AI App</title>
      <link rel="icon" href="/magic.svg" />
    </Head>

    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles />
      <Box>
        <SessionProvider>
          <Component {...pageProps} />
        </SessionProvider>
      </Box>
    </ThemeProvider>
  </Layout>;

export default api.withTRPC(MyApp);
