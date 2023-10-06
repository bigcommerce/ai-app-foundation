import { Flex } from '@bigcommerce/big-design';
import styled from 'styled-components';

export const StyledFlex = styled(Flex)`
  div:nth-child(2) {
    height: ${({ theme }) => theme.helpers.remCalc(300)};
    max-height: ${({ theme }) => theme.helpers.remCalc(500)};
    min-height: ${({ theme }) => theme.helpers.remCalc(150)};
  }
`;

export const StyledAiResults = styled(Flex)`
  button[role='button'] {
    display: none;
  }
`;
