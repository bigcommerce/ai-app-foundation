import React, { useState } from 'react';
import {
    Checkbox,
    Collapse,
    Counter,
    FormGroup,
    Input,
    Select,
    CheckboxLabel,
    FormControlLabel,
    Flex
} from '@bigcommerce/big-design';
import { InputLabel } from '~/components/PromptForm/InputLabel';
import { type StructuredAttributes } from '~/context/PromptAttributesContext';

type InputFieldValue = string | number | boolean | undefined;

export const STYLE_OPTIONS = [
    { value: 'concise', content: 'Concise' },
    { value: 'featureBased', content: 'Features-based' },
    { value: 'benefitsBased', content: 'Benefits-based' },
    { value: 'professional', content: 'Professional' },
    { value: 'humorous', content: 'Humorous' },
    { value: 'emotional', content: 'Emotional' },
    { value: 'story', content: 'Story-telling' },
];

interface StructuredFormProps {
    attributes: StructuredAttributes;
    onChange(attributes: StructuredAttributes): void;
}

export function StucturedPromptForm({ attributes, onChange }: StructuredFormProps) {
    const [collapseTitle, setCollapseTitle] = useState('Show more');

    const handleCollapseChange = (isOpen: boolean) => setCollapseTitle(isOpen ? 'Show less' : 'Show more');

    const handleInputChange = (value: InputFieldValue, fieldName: keyof StructuredAttributes) =>
        onChange({ ...attributes, [fieldName]: value });

    return (
        <>
            <Flex
                alignItems="center"
                flexDirection="row"
                justifyContent="space-between"
            >
                <FormGroup>
                    <Select
                        label="Style"
                        maxHeight={300}
                        onOptionChange={(value) => handleInputChange(value, 'style')}
                        options={STYLE_OPTIONS}
                        placement="bottom-start"
                        required
                        value={attributes.style}
                    />
                </FormGroup>
                <FormGroup>
                    <Counter
                        label="Word limit"
                        max={1000}
                        min={10}
                        step={10}
                        onCountChange={(value) => handleInputChange(value, 'wordCount')}
                        value={attributes.wordCount}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Checkbox
                        checked={attributes.optimizedForSeo}
                        label={
                            <CheckboxLabel>
                                <InputLabel
                                    text="Optimised for SEO"
                                    tooltip="If checked, the description will include words and phrases that shoppers typically use when searching for similar products online. This may improve the visibility of the product in search results and drive more traffic to your storefront."
                                    bold={false}
                                />
                            </CheckboxLabel>
                        }
                        onChange={() => handleInputChange(!attributes.optimizedForSeo, 'optimizedForSeo')}
                    />
                </FormGroup>
            </Flex>

            <Collapse onCollapseChange={handleCollapseChange} title={collapseTitle}>
                <FormGroup>
                    <Flex flexDirection="row" alignItems="center">
                        <Checkbox
                            checked={attributes.includeProductAttributes}
                            label={
                                <CheckboxLabel>
                                    <InputLabel
                                        bold={false}
                                        text="Include product information"
                                        tooltip="If checked, the description will feature information from the product page for this product. This includes: product name, product type, brand, dimensions and weight, categories and condition."
                                    />
                                </CheckboxLabel>
                            }
                            onChange={() => handleInputChange(!attributes.includeProductAttributes, 'includeProductAttributes')}
                        />
                    </Flex>
                </FormGroup>
                <FormGroup>
                    <Input
                        value={attributes.brandVoice}
                        label={
                            <FormControlLabel>
                                <InputLabel
                                    bold={true}
                                    text="Brand voice"
                                    tooltip="Enter the words that best describe the personality of your brand. For example, “upbeat and confident” or “friendly and conversational.”"
                                />
                            </FormControlLabel>
                        }
                        onChange={(event) => handleInputChange(event.target.value, 'brandVoice')}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        value={attributes.additionalAttributes}
                        label={
                            <FormControlLabel>
                                <InputLabel
                                    bold={true}
                                    text="Attributes"
                                    tooltip="Enter any words or phrases that help describe or differentiate this product in addition to what is already mentioned on the product information page. You should enter attributes as key-value pairs. For example, “color: red” or “material: recycled cotton”."
                                />
                            </FormControlLabel>
                        }
                        onChange={(event) => handleInputChange(event.target.value, 'additionalAttributes')}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        value={attributes.keywords}
                        label={
                            <FormControlLabel>
                                <InputLabel
                                    bold={true}
                                    text="Keywords"
                                    tooltip="Enter any words or phrases that you want to make sure are included in the description."
                                />
                            </FormControlLabel>
                        }
                        onChange={(event) => handleInputChange(event.target.value, 'keywords')}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        value={attributes.instructions}
                        label={
                            <FormControlLabel>
                                <InputLabel
                                    bold={true}
                                    text="Instructions"
                                    tooltip="You can fine-tune your description by entering any special instructions here. For example, words or phrases to avoid or formatting requirements."
                                />
                            </FormControlLabel>
                        }
                        onChange={(event) => handleInputChange(event.target.value, 'instructions')}
                    />
                </FormGroup>
            </Collapse>
        </>
    );
}
