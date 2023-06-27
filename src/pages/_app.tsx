import { type AppType } from "next/app";
import { api } from "~/utils/api";


import { Box, GlobalStyles } from '@bigcommerce/big-design';
import { theme as defaultTheme } from '@bigcommerce/big-design-theme';
import { ThemeProvider } from 'styled-components';
// import SessionProvider from '../context/session';

const MyApp: AppType = ({ Component, pageProps }) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  <ThemeProvider theme={defaultTheme}>
    <GlobalStyles />
    <Box
      marginHorizontal={{ mobile: 'none', tablet: 'xxxLarge' }}
      marginVertical={{ mobile: 'none', tablet: "xxLarge" }}
    >
      {/* <SessionProvider> */}
      <Component {...pageProps} />
      {/* </SessionProvider> */}
    </Box>
  </ThemeProvider>
  ;

export default api.withTRPC(MyApp);
