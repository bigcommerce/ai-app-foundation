import { Flex, Pagination, Textarea, Small, H3, Grid } from "@bigcommerce/big-design";
import React, { type SetStateAction, type ChangeEvent, useState } from "react";
import { type Result } from "./types";
import styled from 'styled-components';

interface AiResultsProps {
    results: Result[];
    onChange(index: number, description: string): void;
}

const StyledTextarea = styled(Flex)`
  & > div:first-child {
    width: 100%;
  }
  textarea {
    height: ${({ theme }) => theme.helpers.remCalc(300)};
    max-height: ${({ theme }) => theme.helpers.remCalc(500)};
    min-height: ${({ theme }) => theme.helpers.remCalc(150)};
  }
`;

export default function AiResults({ results, onChange }: AiResultsProps) {
    const [page, setPage] = useState(results.length);

    const currentResult = results.at(page - 1);

    if (!currentResult) {
        return null;
    }

    const handlePageChange = (newPage: SetStateAction<number>) => setPage(Number(newPage));
    const handleValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => onChange(page - 1, event.target.value);

    return (
        <Flex marginTop="xxLarge" flexDirection="column">
            <Grid gridColumns="repeat(2, 1fr)" marginBottom="xxSmall">
                <Flex flexDirection="row" alignItems="center">
                    <H3 marginBottom="none">Results</H3>
                </Flex>
                <Flex alignItems="flex-end" justifyContent="flex-end" flexDirection="row">
                    <Pagination
                        currentPage={page}
                        itemsPerPage={1}
                        itemsPerPageOptions={[page]}
                        onItemsPerPageChange={() => null}
                        onPageChange={handlePageChange}
                        totalItems={results.length}
                    />
                </Flex>
            </Grid>
            <StyledTextarea>
                <Textarea onChange={handleValueChange} value={currentResult.description} />
            </StyledTextarea>
            <Small marginTop="medium">{currentResult.promptAttributes}</Small>
        </Flex>
    );
}
