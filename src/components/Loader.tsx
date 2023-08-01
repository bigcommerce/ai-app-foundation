import { ProgressCircle } from "@bigcommerce/big-design";
import { FullSizeContainer } from '~/components/FullSizeContainer';

export default function Loader() {
    return (
        <FullSizeContainer alignItems="center" justifyContent="center">
            <ProgressCircle size="large" />
        </FullSizeContainer>
    );
}
