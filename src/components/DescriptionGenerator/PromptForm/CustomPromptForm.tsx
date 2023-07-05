import { type BasePromptFormProps } from './types';
import { Checkbox, CheckboxLabel, FormControlLabel, FormGroup, Textarea } from '@bigcommerce/big-design';
import React, { type ChangeEvent, useEffect, useState } from 'react';
import { type CustomPromptAttributes } from '../types';
import { InputLabel } from '~/components/DescriptionGenerator/PromptForm/InputLabel';

type InputFieldValue = string | boolean | undefined;

const INITIAL_FORM_ATTRIBUTES: CustomPromptAttributes = {
    includeProductAttributes: true,
    customPrompt: 'Short product description highlighting usage innovative environment-friendly materials. Include material names, tell about props of each and compare to the most popular ones. Add summary in a last paragraph. Make it sound professional and convincing.',
};

export function CustomPromptForm({ onChange }: BasePromptFormProps) {
    const [formAttributes, setFormAttributes] = useState(INITIAL_FORM_ATTRIBUTES);

    const handleInputChange = (value: InputFieldValue, fieldName: keyof CustomPromptAttributes) => {
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
            <FormGroup>
                <Textarea
                    label={
                        <FormControlLabel>
                            <InputLabel
                                bold={true}
                                text="Instructions"
                                tooltip="Enter your custom instructions for AI to generate the description"
                                // TODO: Change tooltip copy once the design is ready
                            />
                        </FormControlLabel>
                    }
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => handleInputChange(event.target.value, 'customPrompt')}
                    rows={4}
                    value={formAttributes.customPrompt}
                />
            </FormGroup>
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
        </>
    );
}