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
      <Panel header="Generate eye-catching descriptions in a flash">
        <Text>
          Using the product information from your catalog, BigAI Copywriter creates product descriptions in limitless styles and voices
          designed to drive traffic to your storefront and generate sales.
        </Text>
        <H4>How to generate</H4>
        <Text>
          Open an existing product or create a new one. Under description, click on the 
          &quot;Generate text&quot; action and check the result.
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
