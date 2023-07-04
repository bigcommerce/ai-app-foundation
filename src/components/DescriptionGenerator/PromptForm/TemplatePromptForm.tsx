import { type TemplatePromptAttributes } from '../types';
import React, { useState } from 'react';
import {
    Checkbox,
    Collapse,
    Counter,
    FormGroup,
    Text,
    Input,
    Select,
    CheckboxLabel,
    FormControlLabel,
    Tooltip,
    Flex
} from '@bigcommerce/big-design';
import { type PromptFormProps } from '~/components/DescriptionGenerator/PromptForm/types';
import { BaselineHelpIcon } from '@bigcommerce/big-design-icons';

type InputFieldValue = string | number | boolean | undefined;

const STYLE_OPTIONS = [
    { value: 'concise', content: 'Concise' },
    { value: 'featureBased', content: 'Features-based' },
    { value: 'benefitsBased', content: 'Benefits-based' },
    { value: 'professional', content: 'Professional' },
    { value: 'humorous', content: 'Humorous' },
    { value: 'emotional', content: 'Emotional' },
    { value: 'story', content: 'Story-telling' },
];

const DEFAULT_PROMPT_ATTRIBUTES: TemplatePromptAttributes = {
    style: 'story',
    wordCount: 250,
    includeProductAttributes: true,
    optimizedForSeo: true,
    brandVoice: '',
    additionalAttributes: '',
    keywords: '',
    instructions: '',
  };

interface InputLabelProps {
    text: string;
    tooltip: string;
    bold: boolean;
}

export const InputLabel = ({ text, tooltip, bold }: InputLabelProps) => (
    <Flex flexDirection="row" marginBottom="xxSmall" alignItems="center">
        <Text as="span" bold={bold} marginBottom="none" marginRight="xxSmall">
            {text}
        </Text>
        <Tooltip placement="right" trigger={<BaselineHelpIcon color="secondary50" size="large" />}>
            {tooltip}
        </Tooltip>
    </Flex>
);

export function TemplatePromptForm({ onChange }: PromptFormProps) {
    const [formAttributes, setFormAttributes] = useState(DEFAULT_PROMPT_ATTRIBUTES);

    const handleInputChange = (value: InputFieldValue, fieldName: keyof TemplatePromptAttributes) => {
        const updatedAttributes = {
            ...formAttributes,
            [fieldName]: value
        };

        setFormAttributes(updatedAttributes);
        onChange(updatedAttributes);
    }

    return (
        <>
            <FormGroup>
                <Select
                    label="Style"
                    maxHeight={300}
                    onOptionChange={(value) => {
                        handleInputChange(value, 'style');
                    }}
                    options={STYLE_OPTIONS}
                    placement="bottom-start"
                    required
                    value={formAttributes.style}
                />
            </FormGroup>
            <FormGroup>
                <Counter
                    label="Word limit"
                    max={1000}
                    min={10}
                    step={10}
                    onCountChange={(value) => handleInputChange(value, 'wordCount')}
                    value={formAttributes.wordCount}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Checkbox
                    checked={formAttributes.optimizedForSeo}
                    label="Optimised for SEO"
                    onChange={() => handleInputChange(!formAttributes.optimizedForSeo, 'optimizedForSeo')}
                />
            </FormGroup>

            <Collapse title="Show more">
                <FormGroup>
                    <Checkbox
                        checked={formAttributes.includeProductAttributes}
                        label={
                            <CheckboxLabel>
                                <InputLabel
                                    bold={false}
                                    text="Include product information"
                                    tooltip="If checked, the description will feature information from the product page for this product. This includes: product name, product type, brand, dimensions and weight, categories and condition."
                                />
                            </CheckboxLabel>
                        }
                        onChange={() => handleInputChange(!formAttributes.includeProductAttributes, 'includeProductAttributes')}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        value={formAttributes.brandVoice}
                        label={
                            <FormControlLabel>
                                <InputLabel
                                    bold={true}
                                    text="Brand voice"
                                    tooltip="Enter the words that best describe the personality of your brand. For example, “upbeat and confident” or “friendly and conversational.”"
                                />
                            </FormControlLabel>
                        }
                        placeholder="Upbeat, positive, and fun"
                        onChange={(event) => handleInputChange(event.target.value, 'brandVoice')}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        value={formAttributes.additionalAttributes}
                        label={
                            <FormControlLabel>
                                <InputLabel
                                    bold={true}
                                    text="Attributes"
                                    tooltip="Enter any words or phrases that help describe or differentiate this product in addition to what is already mentioned on the product information page. You should enter attributes as key-value pairs. For example, “color: red” or “material: recycled cotton”."
                                />
                            </FormControlLabel>
                        }
                        placeholder="Organic, recycled cotton"
                        onChange={(event) => handleInputChange(event.target.value, 'additionalAttributes')}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        value={formAttributes.keywords}
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
                        value={formAttributes.instructions}
                        label={
                            <FormControlLabel>
                                <InputLabel
                                    bold={true}
                                    text="Instructions"
                                    tooltip="Enter any additional instructions, e.g. “do not use word X“ or “no capital letters“"
                                    // TODO: Change tooltip copy once the design is ready
                                />
                            </FormControlLabel>
                        }
                        onChange={(event) => handleInputChange(event.target.value, 'instructions')}
                    />
                </FormGroup>
            </Collapse>
        </>)
}