import { Box, Flex } from '@bigcommerce/big-design';
import styled, { css } from 'styled-components';

export const StyledMaxWidthContainer = styled(Box)<{ maxWidth?: number }>`
  ${({ maxWidth, theme }) =>
    maxWidth &&
    css`
      background-color: ${theme.colors.secondary10};
      box-sizing: content-box;
      margin: 0 auto;
      max-width: ${theme.helpers.remCalc(maxWidth)};
      min-height: 100vh;
    `}
`;
