import { Flex, Modal, Box, Button, FlexItem } from "@bigcommerce/big-design";
import { useState } from "react";
import styled from "styled-components";
import AiResults from "~/components/AiResults";
import Loader from "~/components/Loader";
import PromptForm from "~/components/PromptForm";


const StyledBox = styled(Box)`
  min-height: 60vh;
  margin-left: -${({ theme }) => theme.spacing.medium};
  margin-right: -${({ theme }) => theme.spacing.medium};

  ${({ theme }) => theme.breakpoints.tablet} {
    margin-left: -${({ theme }) => theme.spacing.xLarge};
    margin-right: -${({ theme }) => theme.spacing.xLarge};
  }
`;

export default function ProductAppExtensionContent() {
  const [isOpen, setIsOpen] = useState(true);
  const isLoading = false;

  const historyResults = ['Desc1', 'Desc2', 'Introducing our white Basic cotton t-shirt, size M, with an oversized fit. But here\'s the twist: it\'s made of recycled organic cotton. This t-shirt is more than just clothing; it\'s a sustainable statement, offering comfort and style. Embrace the story, wear it proudly, and be part of a greener tomorrow.'];
  const [description, setDescription] = useState(historyResults.at(-1));
  const [promptAttributes, setPromptAttributes] = useState('Concise; 150 words; Optimized for SEO; Include product attributes; Brand voice: Upbeat, conversational, and confident; additional attributes: Organic, recycled cotton; additional instructions: Write everything in sentence case.');

  const handleResultChange = (index: number, description: string) => {
    setDescription(description);
    // set local storage for this index
  };

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
          <Flex flexDirection="row" margin="large">
            <FlexItem flexShrink={0}>
              <PromptForm onChange={(prompt) => setPromptAttributes(prompt)} />
            </FlexItem>
            {isLoading && <Loader />}
            {!isLoading &&
              <FlexItem flexGrow={1}>
                <AiResults onChange={handleResultChange} results={historyResults} promptAttributes={promptAttributes} />
              </FlexItem>
            }
          </Flex>
        </StyledBox>
      </Modal >

      <Button variant="secondary" onClick={() => setIsOpen(true)}>Write with AI</Button>
    </>
  );
}
