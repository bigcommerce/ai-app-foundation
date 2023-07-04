import { type PromptFormProps } from './types';
import { Checkbox, FormGroup, Textarea } from '@bigcommerce/big-design';
import { type ChangeEvent, useState } from 'react';
import { type CustomPromptAttributes } from '../types';

type InputFieldValue = string | boolean | undefined;

const INITIAL_FORM_ATTRIBUTES: CustomPromptAttributes = {
    includeProductAttributes: true,
    customPrompt: 'Short product description highlighting usage innovative environment-friendly materials. Include material names, tell about pros of each and compare to the most popular ones. Add summary in a last paragraph. Make it sound professional and convincing.',
};

export function CustomPromptForm({ onChange }: PromptFormProps) {
    const [formAttributes, setFormAttributes] = useState(INITIAL_FORM_ATTRIBUTES);

    const handleInputChange = (value: InputFieldValue, fieldName: keyof CustomPromptAttributes) => {
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
                <Textarea
                    label="Instructions"
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => handleInputChange(event.target.value, 'customPrompt')}
                    rows={4}
                    value={formAttributes.customPrompt}
                />
            </FormGroup>
            <FormGroup>
                <Checkbox
                    checked={formAttributes.includeProductAttributes}
                    label="Include product information"
                    onChange={() => handleInputChange(!formAttributes.includeProductAttributes, 'includeProductAttributes')}
                />
            </FormGroup>
        </>
    );
}