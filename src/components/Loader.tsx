import { Flex, ProgressCircle } from "@bigcommerce/big-design";
import styled from 'styled-components';

const LoaderContainer = styled(Flex)`
  height: 100%;
  width: 100%;
`

export default function Loader() {
    return (
        <LoaderContainer alignItems="center" justifyContent="center">
            <ProgressCircle size="large" />
        </LoaderContainer>
    );
}
