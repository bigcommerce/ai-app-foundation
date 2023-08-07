'use client';

import { usePromptAttributes } from '~/context/PromptAttributesContext';
import { useDescriptionsHistory } from '~/hooks';
import { useState } from 'react';
import { type NewProduct, type Product } from 'types';
import styled from 'styled-components';
import { Box, Button, Flex, FlexItem } from '@bigcommerce/big-design';
import AiResults from '~/components/AiResults/AiResults';
import { CustomPromptForm } from '~/components/PromptForm/CustomPromptForm';
import { GuidedPromptForm } from '~/components/PromptForm/GuidedPromptForm';
import { StyledButton } from '~/components/PromptForm/styled';
import { prepareAiPromptAttributes } from '~/utils/utils';
import Loader from '~/components/Loader';

const Hr = styled(Flex)`
  margin-left: -${({ theme }) => theme.spacing.xLarge};
  margin-right: -${({ theme }) => theme.spacing.xLarge};
`;

export default function Form({ product }: { product: Product | NewProduct }) {
  const { results, setResults, handleDescriptionChange } =
    useDescriptionsHistory(product.id);
  const [isPrompting, setIsPrompting] = useState(false);
  const [description, setDescription] = useState(
    results.at(0)?.description || ''
  );

  const {
    isFormGuided,
    setIsFormGuided,
    currentAttributes,
    guidedAttributes,
    customAttributes,
    setGuidedAttributes,
    setCustomAttributes,
  } = usePromptAttributes();

  const handleGenerateDescription = async () => {
    setIsPrompting(true);
    const res = await fetch('/api/generateDescription', {
      method: 'POST',
      body: JSON.stringify(
        prepareAiPromptAttributes(currentAttributes, product)
      ),
    });

    if (!res.ok) {
      setIsPrompting(false);
      throw new Error('Cannot generate description, try again later');
    }

    const { description } = (await res.json()) as { description: string };
    setResults({ promptAttributes: currentAttributes, description });
    setIsPrompting(false);
  };

  const descriptionChangeWrapper = (index: number, description: string) => {
    setDescription(description);
    handleDescriptionChange(index, description);
  };

  const handleCancelClick = () =>
    window.top?.postMessage(
      JSON.stringify({ namespace: 'APP_EXT', action: 'CLOSE' }),
      '*'
    );
  const handleUseThisClick = () =>
    window.top?.postMessage(
      JSON.stringify({
        namespace: 'APP_EXT',
        action: 'PRODUCT_DESCRIPTION',
        data: { description },
      }),
      '*'
    );

  return (
    <Flex flexDirection="column" padding="xSmall" style={{ minHeight: '90vh' }}>
      <FlexItem>
        <Box display="inline-flex" marginBottom="large">
          <StyledButton
            isActive={isFormGuided}
            onClick={() => setIsFormGuided(true)}
          >
            Guided
          </StyledButton>
          <StyledButton
            isActive={!isFormGuided}
            onClick={() => setIsFormGuided(false)}
          >
            Custom
          </StyledButton>
        </Box>
        {isFormGuided ? (
          <GuidedPromptForm
            attributes={guidedAttributes}
            onChange={setGuidedAttributes}
          />
        ) : (
          <CustomPromptForm
            attributes={customAttributes}
            onChange={setCustomAttributes}
          />
        )}
        <FlexItem>
          <Button
            marginTop="xSmall"
            disabled={isPrompting}
            mobileWidth="auto"
            variant="secondary"
            onClick={() => void handleGenerateDescription()}
          >
            Generate
          </Button>
        </FlexItem>
      </FlexItem>
      {isPrompting && <Loader />}
      {!isPrompting && (
        <>
          <Hr borderTop="box" marginTop="large" />
          <AiResults onChange={descriptionChangeWrapper} results={results} />
          <Flex
            justifyContent="flex-end"
            flexDirection="row"
            marginTop="xxLarge"
          >
            <Button
              mobileWidth="auto"
              variant="secondary"
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
            <Button
              mobileWidth="auto"
              variant="primary"
              onClick={handleUseThisClick}
            >
              Use this
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
}
