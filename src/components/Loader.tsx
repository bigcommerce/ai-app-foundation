'use client';

import { Flex, ProgressCircle } from "@bigcommerce/big-design";

export default function Loader() {
    return (
        <Flex justifyContent="center" alignItems="center" style={{ minHeight: "50vh" }}>
            <ProgressCircle size="large" />
        </Flex>
    );
}
