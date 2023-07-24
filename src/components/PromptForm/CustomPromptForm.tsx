import { Checkbox, CheckboxLabel, FormControlLabel, FormGroup, Textarea } from '@bigcommerce/big-design';
import React, { type ChangeEvent } from 'react';
import { InputLabel } from '~/components/PromptForm/InputLabel';
import { type CustomAttributes } from '~/context/PromptAttributesContext';
interface CustomFormProps {
    attributes: CustomAttributes;
    onChange(attributes: CustomAttributes): void;
}

export const CustomPromptForm = ({ attributes, onChange }: CustomFormProps) =>
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
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange({ ...attributes, customPrompt: event.target.value })}
                rows={4}
                value={attributes.customPrompt}
            />
        </FormGroup>
        <FormGroup>
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
                onChange={() => onChange({ ...attributes, includeProductAttributes: !attributes.includeProductAttributes })}
            />
        </FormGroup>
    </>
    ;
