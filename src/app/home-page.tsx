'use client';

import React from 'react';
import { Text, Panel, H1, Box, H4 } from '@bigcommerce/big-design';
import { StyledMaxWidthContainer } from '~/components/LayoutHelpers';
import Image from 'next/image';

const HomePage = () => (
  <Box backgroundColor="secondary10">
    <StyledMaxWidthContainer
      maxWidth={768}
      paddingHorizontal={{ mobile: 'small', tablet: 'xxxLarge' }}
      paddingVertical={{ mobile: 'small', tablet: 'xxLarge' }}
    >
      <H1>
        <Image
          src="/images/bigcommerce-icon.png"
          alt="BigCommerce"
          priority={true}
          height={30}
          width={30}
          style={{
            marginRight: '0.5em',
            top: '0.1em',
            position: 'relative',
          }}
        />
        BigAI Copywriter
      </H1>
      <Panel header="Create product descriptions">
        <Text>
            BigAI Copywriter app extends the capabilities of the existing Description section of the v3 Add/Edit Product experience.
        </Text>
        <H4>How to generate</H4>
        <Text as="span">
            <Text as="span" bold={true}>
                You will now see a new button in the Description section when adding or editing a product.
            </Text>
            <Text as="span">
                Click the Action button (⋯) and select Create text. Set your desired settings, then click Generate to create your text. The generated text will appear in the Results window.
            </Text>
        </Text>
        <Image
          src="/images/example.png"
          alt="Example"
          priority={true}
          height={447}
          width={1336}
          style={{
            border: '1px solid #ccc',
            borderRadius: '6px',
            height: 'auto',
            maxWidth: '100%',
          }}
        />
      </Panel>
    </StyledMaxWidthContainer>
  </Box>
);

export default HomePage;
