import { Checkbox, Collapse, Counter, Flex, FormGroup, Input, Select } from "@bigcommerce/big-design";
import { useState, type SetStateAction, type ChangeEvent } from "react";

export default function PromptForm({ onChange }: { onChange(prompt: string): void }) {
    const [prompt, setPrompt] = useState('template');
    const [style, setStyle] = useState('story');
    const [wordLimit, setWordLimitVal] = useState(250);
    const [withSeo, setWithSeo] = useState(true);
    const [includeProductInfo, setIncludeProductInfo] = useState(true);
    const [brandVoice, setBrandVoice] = useState('');
    const [attributes, setAttributes] = useState('');

    const handleWordLimitChange = (limit: number) => setWordLimitVal(limit);
    const handlePromptChange = (prompt: SetStateAction<string>) => setPrompt(prompt);
    const handleStyleChange = (style: SetStateAction<string>) => setStyle(style);
    const handleIncludeProductInfoChange = (event: ChangeEvent<HTMLInputElement>) => setIncludeProductInfo(event.target.checked);

    return (
        <Flex flexDirection="column" alignItems="flex-start">
            <FormGroup>
                <Select
                    label="Prompt"
                    maxHeight={300}
                    onOptionChange={handlePromptChange}
                    options={[
                        { value: 'template', content: 'Use template' },
                        { value: 'custom', content: 'Custom' },
                    ]}
                    placement="bottom-start"
                    required
                    value={prompt}
                />
            </FormGroup>
            <FormGroup>
                <Select
                    label="Style"
                    maxHeight={300}
                    onOptionChange={handleStyleChange}
                    options={[
                        { value: 'story', content: 'Story-telling' },
                    ]}
                    placement="bottom-start"
                    required
                    value={style}
                />
            </FormGroup>
            <FormGroup>
                <Counter
                    label="Word limit"
                    max={1000}
                    min={10}
                    step={10}
                    onCountChange={handleWordLimitChange}
                    value={wordLimit}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Checkbox
                    checked={true}
                    label="Optimised for SEO"
                    onChange={() => ({})}
                />
            </FormGroup>

            <Collapse title="Show more">
                <FormGroup>
                    <Checkbox
                        checked={includeProductInfo}
                        label="Include product information"
                        onChange={handleIncludeProductInfoChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        value="Upbeat, positive, and fun"
                        label="Brand voice"
                        onChange={() => ({})}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        value="Organic, recycled cotton"
                        label="Attributes"
                        onChange={() => ({})}
                    />
                </FormGroup>
            </Collapse>
        </Flex>
    );
}
