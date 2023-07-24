import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { Box, GlobalStyles } from '@bigcommerce/big-design';
import { theme as defaultTheme } from '@bigcommerce/big-design-theme';
import { ThemeProvider } from 'styled-components';
import Head from "next/head";
import SessionProvider from '../../context/session';

const MyApp: AppType = ({ Component, pageProps }) =>
  <>
    <Head>
      <title>Control Panel AI App</title>
      <link rel="icon" href="/magic.svg" />
    </Head>

    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles />
      <Box
        marginHorizontal={{ mobile: 'none', tablet: 'xxxLarge' }}
        marginVertical={{ mobile: 'none', tablet: "xxLarge" }}
      >
        <SessionProvider>
          <Component {...pageProps} />
        </SessionProvider>
      </Box>
    </ThemeProvider>
  </>;

export default api.withTRPC(MyApp);
