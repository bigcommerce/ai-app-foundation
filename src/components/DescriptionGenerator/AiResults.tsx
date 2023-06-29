import { Flex, Pagination, Textarea, Text } from "@bigcommerce/big-design";
import { useState, type SetStateAction, type ChangeEvent } from "react";
import { type Result } from "./DescriptionGenerator";

interface AiResultsProps {
    results: Result[];
    promptAttributes: string;
    onChange(index: number, result: Result): void;
}

export default function AiResults({ results, promptAttributes, onChange }: AiResultsProps) {
    const [value, setValue] = useState(results.at(-1)?.description || '');
    const [page, setPage] = useState(results.length);

    const handlePageChange = (newResultPage: SetStateAction<number>) => {
        const page = Number(newResultPage);
        const val = results.at(page - 1);

        setPage(page);

        if (val) {
            setValue(val.description);
            onChange(page, val);
        }
    };

    const handleValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
        onChange(page, { description: event.target.value, promptAttributes });
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
