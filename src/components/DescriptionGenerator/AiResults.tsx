import { Flex, Pagination, Textarea, Text, Small, Button } from "@bigcommerce/big-design";
import { type SetStateAction, type ChangeEvent, useState } from "react";
import { type Result } from "./types";

interface AiResultsProps {
    results: Result[];
    onChange(index: number, description: string): void;
    generateDescription(): Promise<void>;
}

export default function AiResults({ results, onChange, generateDescription }: AiResultsProps) {
    const [page, setPage] = useState(results.length);

    const currentResult = results.at(page - 1);

    if (!currentResult) {
        return null;
    }

    const handlePageChange = (newPage: SetStateAction<number>) => setPage(Number(newPage));
    const handleValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => onChange(page - 1, event.target.value);

    return (
        <Flex marginLeft="xxLarge" flexDirection="column">
            <Flex marginBottom="medium" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text marginBottom="none">Results</Text>
                <Pagination
                    currentPage={page}
                    itemsPerPage={1}
                    itemsPerPageOptions={[page]}
                    onItemsPerPageChange={() => null}
                    onPageChange={handlePageChange}
                    totalItems={results.length}
                />
            </Flex>
            <Small marginTop="medium">{currentResult.promptAttributes}</Small>
            <Textarea onChange={handleValueChange} value={currentResult.description} />
            <Flex paddingTop="medium">
                <Button variant="secondary" onClick={() => void generateDescription()}>Try Again</Button>
            </Flex>
        </Flex>
    );
}
