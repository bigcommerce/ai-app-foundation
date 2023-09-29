import {
  Flex,
  Pagination,
  Textarea,
  Small,
  H3,
  Grid,
} from '@bigcommerce/big-design';
import React, { type SetStateAction, type ChangeEvent, useState } from 'react';
import { StyledFlex } from './styled';
import { useAppContext } from '~/context/AppContext';
import { useTracking } from '~/hooks/useTracking';

export interface Result {
  description: string;
  promptAttributes: string;
}

interface AiResultsProps {
  results: Result[];
  onChange(index: number, description: string): void;
}

export default function AiResults({ results, onChange }: AiResultsProps) {
  const [page, setPage] = useState(results.length);

  const { locale, storeHash, context } = useAppContext();
  const { trackClick } = useTracking();

  const currentResult = results.at(page - 1);

  const handlePageChange = (newPageVal: SetStateAction<number>) => {
    const newPage = Number(newPageVal);
    setPage(newPage);
    onChange(newPage - 1, results.at(newPage - 1)?.description || '');

    trackClick({
      context,
      locale,
      storeHash,
      action: newPage > page ? 'Next result' : 'Previous result',
    });
  };

  const handleValueChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    onChange(page - 1, event.target.value);

  return (
    <Flex marginTop="large" flexDirection="column">
      <Grid gridColumns="1fr 4fr" marginBottom="medium" gridColumnGap="0">
        <Flex flexDirection="row" alignItems="center">
          <H3 marginBottom="none">Results</H3>
        </Flex>
        <Flex
          alignItems="flex-end"
          justifyContent="flex-end"
          flexDirection="row"
        >
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
      <StyledFlex>
        <Textarea
          onChange={handleValueChange}
          value={currentResult?.description}
        />
      </StyledFlex>
      <Small marginTop="medium">{currentResult?.promptAttributes}</Small>
    </Flex>
  );
}
