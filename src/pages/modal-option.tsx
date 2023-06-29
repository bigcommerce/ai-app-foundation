import { Modal, Box, Button } from "@bigcommerce/big-design";
import { useState } from "react";
import styled from "styled-components";
import DescriptionGenerator, { type Result } from "~/components/DescriptionGenerator/DescriptionGenerator";

const StyledBox = styled(Box)`
  min-height: 60vh;
  margin-left: -${({ theme }) => theme.spacing.medium};
  margin-right: -${({ theme }) => theme.spacing.medium};

  ${({ theme }) => theme.breakpoints.tablet} {
    margin-left: -${({ theme }) => theme.spacing.xLarge};
    margin-right: -${({ theme }) => theme.spacing.xLarge};
  }
`;

export default function ModalOption() {
  const [isOpen, setIsOpen] = useState(false);
  const isLoading = false;

  const results: Result[] = [
    {
      description: 'This is a test description',
      promptAttributes: 'Concise; 5 words; Optimized for SEO; Include product attributes; Brand voice: Upbeat, conversational, and confident; additional attributes: Organic, recycled cotton; additional instructions: Write everything in sentence case.',
    },
    {
      description: 'This is a test description 2',
      promptAttributes: 'Concise; 10 words; Optimized for SEO; Include product attributes; Brand voice: Upbeat, conversational, and confident; additional attributes: Organic, recycled cotton; additional instructions: Write everything in sentence case.',
    }
  ];

  const handleResultChange = (index: number, result: Result) => {
    // set local storage for this index
  };

  const generateDescription = (promptAttributes: PromptAttributes) => ({}); // magic

  return (
    <>
      <Modal
        actions={[
          {
            text: 'Cancel',
            variant: 'subtle',
            onClick: () => setIsOpen(false),
          },
          { text: 'Try Again', onClick: () => console.log('generate'), variant: 'secondary' },
          { text: 'Use this result', onClick: () => console.log('generate') },
        ]}
        closeOnClickOutside={false}
        closeOnEscKey={true}
        header="Write with AI"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <StyledBox borderTop="box" borderBottom="box">
          <DescriptionGenerator isLoading={isLoading} results={results} generateDescription={generateDescription} handleResultChange={handleResultChange} />
        </StyledBox>
      </Modal >

      <Button variant="secondary" onClick={() => setIsOpen(true)}>Write with AI</Button>
    </>
  );
}
