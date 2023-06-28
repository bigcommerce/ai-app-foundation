import { Flex, Pagination, Textarea, Text } from "@bigcommerce/big-design";
import { useState, type SetStateAction, type ChangeEvent } from "react";

export default function AiResults({ results, promptAttributes, onChange }: { results: string[], promptAttributes: string, onChange(index: number, description: string): void }) {
    const [value, setValue] = useState(results.at(-1) || '');
    const [page, setPage] = useState(results.length);

    const handlePageChange = (newResultPage: SetStateAction<number>) => {
        const page = Number(newResultPage);
        const val = results.at(page - 1) || '';

        setValue(val);
        setPage(page);
        onChange(page, val);
    };

    const handleValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
        onChange(page, event.target.value);
    };

    return (
        <Flex marginLeft="xxLarge" flexDirection="column">
            <Flex marginBottom="medium" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text marginBottom="none">Results</Text>
                <Pagination
                    currentPage={page}
                    itemsPerPage={1}
                    itemsPerPageOptions={[page]}
                    onItemsPerPageChange={() => ({})}
                    onPageChange={handlePageChange}
                    totalItems={results.length}
                />
            </Flex>
            <Textarea onChange={handleValueChange} value={value} />
            <Text marginTop="medium" color="secondary60">{promptAttributes}</Text>
        </Flex>
    );
}
