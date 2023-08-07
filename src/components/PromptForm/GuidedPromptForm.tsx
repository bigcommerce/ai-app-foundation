'use client';

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
  Flex,
  Grid,
} from '@bigcommerce/big-design';
import { InputLabel } from '~/components/PromptForm/InputLabel';
import { theme } from '@bigcommerce/big-design-theme';
import { STYLE_OPTIONS } from '~/constants';
import { type GuidedAttributes } from '~/context/PromptAttributesContext';

type InputFieldValue = string | number | boolean | undefined;

interface GuidedPromptForm {
  attributes: GuidedAttributes;
  onChange(attributes: GuidedAttributes): void;
}

export function GuidedPromptForm({ attributes, onChange }: GuidedPromptForm) {
  const [collapseTitle, setCollapseTitle] = useState('Show more');

  const handleCollapseChange = (isOpen: boolean) =>
    setCollapseTitle(isOpen ? 'Show less' : 'Show more');

  const handleInputChange = (
    value: InputFieldValue,
    fieldName: keyof GuidedAttributes
  ) => onChange({ ...attributes, [fieldName]: value });

  return (
    <>
      <Grid gridColumns="2fr 1fr 2fr" gridColumnGap={theme.spacing.large}>
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
          <Flex flexDirection="row" alignItems="center" marginTop="medium">
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
              onChange={() =>
                handleInputChange(
                  !attributes.optimizedForSeo,
                  'optimizedForSeo'
                )
              }
            />
          </Flex>
        </FormGroup>
      </Grid>

      <Collapse onCollapseChange={handleCollapseChange} title={collapseTitle}>
        <Grid
          gridColumns="repeat(1, 1fr)"
          gridRowGap={theme.spacing.xxSmall}
          marginTop="xSmall"
          marginBottom="large"
        >
          <FormGroup>
            <Flex flexDirection="row" alignItems="center">
              <Checkbox
                checked={attributes.includeProductAttributes}
                label={
                  <CheckboxLabel>
                    <InputLabel
                      bold={false}
                      text="Include product information"
                      tooltip="Checking this box will include product information from the control panel in the description. For example, product name and weight."
                    />
                  </CheckboxLabel>
                }
                onChange={() =>
                  handleInputChange(
                    !attributes.includeProductAttributes,
                    'includeProductAttributes'
                  )
                }
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
                    tooltip="Describe how your brand views itself. For example, “upbeat and confident” or “friendly and conversational.”"
                  />
                </FormControlLabel>
              }
              onChange={(event) =>
                handleInputChange(event.target.value, 'brandVoice')
              }
            />
          </FormGroup>
          <FormGroup>
            <Input
              value={attributes.additionalAttributes}
              label={
                <FormControlLabel>
                  <InputLabel
                    bold={true}
                    text="Additional attributes"
                    tooltip="Additional attributes are key-value pairs that provide more information and improve search engine rankings. For example, “organic, recycled cotton” or “sports, running.”"
                  />
                </FormControlLabel>
              }
              onChange={(event) =>
                handleInputChange(event.target.value, 'additionalAttributes')
              }
            />
          </FormGroup>
          <FormGroup>
            <Input
              value={attributes.keywords}
              label={
                <FormControlLabel>
                  <InputLabel
                    bold={true}
                    text="Additional keywords"
                    tooltip="Additional keywords are words or phrases that provide more information and improve search engine rankings. For example, “blue,” “shirt,” “clothing” and “women.”"
                  />
                </FormControlLabel>
              }
              onChange={(event) =>
                handleInputChange(event.target.value, 'keywords')
              }
            />
          </FormGroup>
          <FormGroup>
            <Input
              value={attributes.instructions}
              label={
                <FormControlLabel>
                  <InputLabel
                    bold={true}
                    text="Special instructions "
                    tooltip="If you have any special instructions, you can enter them here. For example, words to avoid, words to be sure and include or special formatting requirements."
                  />
                </FormControlLabel>
              }
              onChange={(event) =>
                handleInputChange(event.target.value, 'instructions')
              }
            />
          </FormGroup>
        </Grid>
      </Collapse>
    </>
  );
}
