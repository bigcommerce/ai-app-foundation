import { Flex } from '@bigcommerce/big-design';
import styled from 'styled-components';

// Workaround to avoid the per page dropdown to be clickable, but still provide the content
export const StyledAiResults = styled(Flex)`
  button[role='button'] {
    pointer-events: none;
    svg {
      display: none;
    }
  }
`;
