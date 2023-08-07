import { Flex } from '@bigcommerce/big-design';
import styled from 'styled-components';

export const StyledFlex = styled(Flex)`
  & > div:first-child {
    width: 100%;
  }
  textarea {
    height: ${({ theme }) => theme.helpers.remCalc(300)};
    max-height: ${({ theme }) => theme.helpers.remCalc(500)};
    min-height: ${({ theme }) => theme.helpers.remCalc(150)};
  }
`;
