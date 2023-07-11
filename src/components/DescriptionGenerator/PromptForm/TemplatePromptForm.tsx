import { type TemplatePromptAttributes } from '../types';
import React, { useEffect, useState } from 'react';
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
import { type BasePromptFormProps } from '~/components/DescriptionGenerator/PromptForm/types';
import { InputLabel } from '~/components/DescriptionGenerator/PromptForm/InputLabel';

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

export function TemplatePromptForm({ onChange }: BasePromptFormProps) {
    const [formAttributes, setFormAttributes] = useState(DEFAULT_PROMPT_ATTRIBUTES);
    const [collapseTitle, setCollapseTitle] = useState('Show more');
    const handleChange = (isOpen: boolean) => setCollapseTitle(isOpen ? 'Show less' : 'Show more');


    const handleInputChange = (value: InputFieldValue, fieldName: keyof TemplatePromptAttributes) => {
        const updatedAttributes = {
            ...formAttributes,
            [fieldName]: value
        };

        setFormAttributes(updatedAttributes);
        onChange(updatedAttributes);
    }

    useEffect(() => {
        onChange(formAttributes);
    }, [formAttributes, onChange]);

    return (
        <>
            <Flex
                alignItems={{ mobile: 'flex-start', tablet: 'center' }}
                flexDirection={{ mobile: 'column', tablet: 'row' }}
                justifyContent="space-between"
            >
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
                        label={
                            <CheckboxLabel>
                                <InputLabel
                                    text="Optimised for SEO"
                                    tooltip="If checked, the description will include words and phrases that shoppers typically use when searching for similar products online. This may improve the visibility of the product in search results and drive more traffic to your storefront."
                                    bold={false}
                                />
                            </CheckboxLabel>
                        }
                        onChange={() => handleInputChange(!formAttributes.optimizedForSeo, 'optimizedForSeo')}
                    />
                </FormGroup>
            </Flex>

                <Collapse onCollapseChange={handleChange} title={collapseTitle}>
                    <FormGroup>
                        <Flex flexDirection="row" alignItems="center">
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
                        </Flex>
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
                                        tooltip="You can fine-tune your description by entering any special instructions here. For example, words or phrases to avoid or formatting requirements."
                                    />
                                </FormControlLabel>
                            }
                            onChange={(event) => handleInputChange(event.target.value, 'instructions')}
                        />
                    </FormGroup>
                </Collapse>
        </>);
}
