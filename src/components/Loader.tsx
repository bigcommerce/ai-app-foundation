import { Flex, ProgressCircle } from "@bigcommerce/big-design";

export default function Loader() {
    return (
        <Flex marginHorizontal="auto" alignItems="center" alignContent="center">
            <ProgressCircle size="large" />
        </Flex>
    );
}
