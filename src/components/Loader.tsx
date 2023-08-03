'use client';

import { Flex, ProgressCircle } from "@bigcommerce/big-design";

export default function Loader({ minHeight = '50vh' }) {
    return (
        <Flex justifyContent="center" alignItems="center" style={{ minHeight }}>
            <ProgressCircle size="large" />
        </Flex>
    );
}
