import {
  Checkbox,
  CheckboxLabel,
  FormControlLabel,
  FormGroup,
  Textarea,
} from '@bigcommerce/big-design';
import React, { type ChangeEvent } from 'react';
import { InputLabel } from '~/components/PromptForm/InputLabel';
import { useAppContext } from '~/context/AppContext';
import { type CustomAttributes } from '~/context/PromptAttributesContext';
import { useTracking } from '~/hooks/useTracking';
interface CustomFormProps {
  attributes: CustomAttributes;
  onChange(attributes: CustomAttributes): void;
}

export const CustomPromptForm = ({ attributes, onChange }: CustomFormProps) => {
  const { locale, storeHash, context } = useAppContext();
  const { trackClick } = useTracking();

  return (
    <>
      <FormGroup>
        <Textarea
          label={
            <FormControlLabel>
              <InputLabel
                bold={true}
                text="Instructions"
                tooltip="Try and provide as much information as possible. You can also try asking the description generator to write in the voice of a famous person, like Shakespeare or Hemingway, or assume a profession, like interior designer or chef."
              />
            </FormControlLabel>
          }
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            onChange({ ...attributes, customPrompt: event.target.value })
          }
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
          onChange={() => {
            onChange({
              ...attributes,
              includeProductAttributes: !attributes.includeProductAttributes,
            });
            trackClick({
              action: !attributes.includeProductAttributes
                ? 'Include Product Attributes On'
                : 'Include Product Attributes Off',
              context,
              storeHash,
              locale,
            });
          }}
        />
      </FormGroup>
    </>
  );
};
