'use client';

import { Flex, ProgressCircle } from "@bigcommerce/big-design";

export default function Loading() {
    return (
        <Flex justifyContent="center" alignItems="center" style={{ minHeight: "90vh" }}>
            <ProgressCircle size="large" />
        </Flex>
    );
}
