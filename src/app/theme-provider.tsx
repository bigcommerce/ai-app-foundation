'use client';

import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme as defaultTheme } from '@bigcommerce/big-design-theme';
import { GlobalStyles } from '@bigcommerce/big-design';

export default function ThemeProvider({ children }) {
  return (
    <StyledThemeProvider theme={defaultTheme}>
      <GlobalStyles />
      {children}
    </StyledThemeProvider>
  );
}
