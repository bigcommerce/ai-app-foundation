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
import { useAppContext } from '~/context/AppContext';
import { useTracking } from '~/hooks/useTracking';

const Hr = styled(Flex)`
  margin-left: -${({ theme }) => theme.spacing.xLarge};
  margin-right: -${({ theme }) => theme.spacing.xLarge};
`;

export default function Form({ product }: { product: Product | NewProduct }) {
  const { descriptions, addDescriptionToHistory, updateDescriptionInHistory } =
    useDescriptionsHistory(product.id);

  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState(
    descriptions.at(-1)?.description || ''
  );

  const { locale, storeHash, context } = useAppContext();
  const { trackSubmit, trackClick } = useTracking();

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
    setIsLoading(true);
    const res = await fetch('/api/generateDescription', {
      method: 'POST',
      body: JSON.stringify(
        prepareAiPromptAttributes(currentAttributes, product)
      ),
    });

    if (!res.ok) {
      setIsLoading(false);
      throw new Error('Cannot generate description, try again later');
    }

    const { description } = (await res.json()) as { description: string };
    addDescriptionToHistory({
      promptAttributes: currentAttributes,
      description,
    });
    setDescription(description);
    setIsLoading(false);

    trackClick({ context, locale, storeHash, action: 'Generate' });
  };

  const descriptionChangeWrapper = (index: number, description: string) => {
    setDescription(description);
    updateDescriptionInHistory(index, description);
  };

  const handleCancelClick = () => {
    window.top?.postMessage(
      JSON.stringify({ namespace: 'APP_EXT', action: 'CLOSE' }),
      '*'
    );
    trackClick({ context, locale, storeHash, action: 'Cancel' });
  };
  const handleUseThisClick = () => {
    window.top?.postMessage(
      JSON.stringify({
        namespace: 'APP_EXT',
        action: 'PRODUCT_DESCRIPTION',
        data: { description },
      }),
      '*'
    );
    trackSubmit({
      context,
      locale,
      storeHash,
      isFormGuided,
      guidedAttributes,
      customAttributes,
      results: descriptions.length,
    });
    trackClick({ context, locale, storeHash, action: 'Use this' });
  };

  return (
    <Flex flexDirection="column" padding="xSmall" style={{ minHeight: '90vh' }}>
      <FlexItem>
        <Box display="inline-flex" marginBottom="large">
          <StyledButton
            isActive={isFormGuided}
            onClick={() => {
              setIsFormGuided(true);
              trackClick({ context, locale, storeHash, action: 'Guided' });
            }}
          >
            Guided
          </StyledButton>
          <StyledButton
            isActive={!isFormGuided}
            onClick={() => {
              setIsFormGuided(false);
              trackClick({ context, locale, storeHash, action: 'Custom' });
            }}
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
            disabled={isLoading}
            mobileWidth="auto"
            variant="secondary"
            onClick={() => void handleGenerateDescription()}
          >
            Generate
          </Button>
        </FlexItem>
      </FlexItem>
      {isLoading && <Loader />}
      {!isLoading && (
        <>
          <Hr borderTop="box" marginTop="large" />
          <AiResults
            onChange={descriptionChangeWrapper}
            results={descriptions}
          />
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
              disabled={!description}
            >
              Use this
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
}
