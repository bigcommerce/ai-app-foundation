import { type TemplatePromptAttributes } from '../types';
import { useState } from 'react';
import { Checkbox, Collapse, Counter, FormGroup, Input, Select } from '@bigcommerce/big-design';
import { type PromptFormProps } from '~/components/DescriptionGenerator/PromptForm/types';

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
    additionalAttributes: ''
  };

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
                        label="Include product information"
                        onChange={() => handleInputChange(!formAttributes.includeProductAttributes, 'includeProductAttributes')}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        value={formAttributes.brandVoice}
                        label="Brand voice"
                        placeholder="Upbeat, positive, and fun"
                        onChange={(event) => handleInputChange(event.target.value, 'brandVoice')}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        value={formAttributes.additionalAttributes}
                        label="Attributes"
                        placeholder="Organic, recycled cotton"
                        onChange={(event) => handleInputChange(event.target.value, 'additionalAttributes')}
                    />
                </FormGroup>
            </Collapse>
        </>)
}