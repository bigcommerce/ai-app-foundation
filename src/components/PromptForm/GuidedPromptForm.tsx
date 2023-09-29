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
import { useTracking } from '~/hooks/useTracking';
import { useAppContext } from '~/context/AppContext';

type InputFieldValue = string | number | boolean | undefined;

interface GuidedPromptForm {
  attributes: GuidedAttributes;
  onChange(attributes: GuidedAttributes): void;
}

export function GuidedPromptForm({ attributes, onChange }: GuidedPromptForm) {
  const [collapseTitle, setCollapseTitle] = useState('Show more');

  const { locale, storeHash, context } = useAppContext();
  const { trackClick } = useTracking();

  const handleCollapseChange = (isOpen: boolean) => {
    const title = isOpen ? 'Show less' : 'Show more';
    setCollapseTitle(title);

    trackClick({
      action: title,
      context,
      storeHash,
      locale,
    });
  };

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
            min={1}
            step={10}
            onCountChange={(value) => {
              handleInputChange(value, 'wordCount');

              trackClick({
                action:
                  value > attributes.wordCount
                    ? 'PlusWordLimit'
                    : 'MinusWordLimit',
                context,
                storeHash,
                locale,
              });
            }}
            value={attributes.wordCount}
            required
          />
        </FormGroup>
        <FormGroup>
          <Flex flexDirection="row" alignItems="center" marginTop="xxLarge">
            <Checkbox
              checked={attributes.optimizedForSeo}
              label={
                <CheckboxLabel>
                  <InputLabel
                    text="Optimize for SEO"
                    tooltip="If checked, the description will include words and phrases that shoppers typically use when searching for similar products online. This may improve the visibility of the product in search results and drive more traffic to your storefront."
                    bold={false}
                  />
                </CheckboxLabel>
              }
              onChange={() => {
                handleInputChange(
                  !attributes.optimizedForSeo,
                  'optimizedForSeo'
                );
                trackClick({
                  action: !attributes.optimizedForSeo ? 'SEO On' : 'SEO Off',
                  context,
                  storeHash,
                  locale,
                });
              }}
            />
          </Flex>
        </FormGroup>
        <FormGroup>
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
            onChange={() => {
              handleInputChange(
                !attributes.includeProductAttributes,
                'includeProductAttributes'
              );
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
      </Grid>

      <Collapse onCollapseChange={handleCollapseChange} title={collapseTitle}>
        <Grid
          gridColumns="repeat(1, 1fr)"
          gridRowGap={theme.spacing.xxSmall}
          marginTop="xSmall"
          marginBottom="large"
        >
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
              value={attributes.keywords}
              label={
                <FormControlLabel>
                  <InputLabel
                    bold={true}
                    text="Additional keywords"
                    tooltip="Enter any important keywords, separated by commas, you want to make sure are included in the description. For example, “blue, shirt, clothing, women.” These keywords will be used throughout the description wherever it makes sense."
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
