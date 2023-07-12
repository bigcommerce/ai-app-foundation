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
                                tooltip="Here are some tips to get a better quality product description. Imagine that you’re talking to a person. Provide as much context as possible. Ask the AI to assume a profession relevant to what you're selling, like interior designer or chef, for example. You can also try asking the AI to write as a famous person with a distinct voice, like Shakespeare or Hemingway."
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