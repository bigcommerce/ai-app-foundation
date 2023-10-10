import { Flex, Small, H3, Pagination } from '@bigcommerce/big-design';
import React, { type SetStateAction, useState } from 'react';
import { StyledAiResults } from './styled';
import { useAppContext } from '~/context/AppContext';
import { useTracking } from '~/hooks/useTracking';
import Editor from '../Editor/Editor';
import Loader from '../Loader';

export interface Result {
  description: string;
  promptAttributes: string;
}

interface AiResultsProps {
  results: Result[];
  onChange(index: number, description: string): void;
}

export default function AiResults({ results, onChange }: AiResultsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(results.length);

  const { locale, storeHash, context } = useAppContext();
  const { trackClick } = useTracking();

  const currentResult = results.at(page - 1);
  const initialEditorValue = currentResult?.description || '';

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

  const handleValueChange = (editorState: string) =>
    onChange(page - 1, editorState);

  return (
    <Flex marginTop="large" flexDirection="column">
      {isLoading && <Loader />}
      <StyledAiResults
        marginVertical="medium"
        alignItems="flex-end"
        justifyContent="space-between"
        flexDirection="row"
      >
        {!isLoading && (
          <>
            <Flex flexDirection="column" alignItems="flex-start">
              <H3 marginBottom="none">Results</H3>
              <Small>Please review and proofread before publishing.</Small>
            </Flex>
            <Pagination
              currentPage={page}
              itemsPerPage={1}
              itemsPerPageOptions={[page]}
              onItemsPerPageChange={() => null}
              onPageChange={handlePageChange}
              totalItems={results.length}
            />
          </>
        )}
      </StyledAiResults>
      <Editor
        initialValue={initialEditorValue}
        onChange={handleValueChange}
        onInit={() => setIsLoading(false)}
      />
      {!isLoading && (
        <Small marginTop="medium">{currentResult?.promptAttributes}</Small>
      )}
    </Flex>
  );
}
