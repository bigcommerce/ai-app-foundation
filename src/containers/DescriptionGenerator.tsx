import { Flex, FlexItem, Button, Box } from "@bigcommerce/big-design";
import { type NewProduct, type Product } from "types";
import AiResults from "~/components/AiResults/AiResults";
import Loader from "~/components/Loader";
import { CustomPromptForm } from "~/components/PromptForm/CustomPromptForm";
import { StucturedPromptForm } from "~/components/PromptForm/StructuredPromptForm";
import { StyledButton } from "~/components/PromptForm/styled";
import { usePromptAttributes } from "~/context/PromptAttributesContext";
import { useAIDescriptions } from "~/hooks";
import { prepareAiPromptAttributes } from "~/utils/utils";
import styled from 'styled-components';
import { FullSizeContainer } from '~/components/FullSizeContainer';

const FullScreenHeightWrapper = styled(Flex)`
  min-height: 100vh;
`

const Hr = styled(Flex)`
  margin-left: -${({ theme }) => theme.spacing.xLarge};
  margin-right: -${({ theme }) => theme.spacing.xLarge};
`

interface DescriptonGeneratorProps {
    product: Product | NewProduct;
}

export default function DescriptonGenerator({ product }: DescriptonGeneratorProps) {
    const {
        isPrompting,
        results,
        generateDescription,
        setResults,
        handleDescriptionChange
    } = useAIDescriptions(product.id);

    const {
        isFormStructured,
        setIsFormStructured,
        currentAttributes,
        structuredAttributes,
        customAttributes,
        setStructuredAttributes,
        setCustomAttributes
    } = usePromptAttributes();

    const handleGenerateDescription = () => {
        const input = prepareAiPromptAttributes(currentAttributes, product);
        void generateDescription(
            input,
            { onSuccess: (description) => setResults({ promptAttributes: currentAttributes, description }) }
        );
    };

    return (
        <FullScreenHeightWrapper flexDirection="column" justifyContent="space-between" padding="xLarge">
            <FullSizeContainer flexDirection="column">
                <FlexItem>
                    <Box display="inline-flex" marginBottom="large">
                        <StyledButton isActive={isFormStructured} onClick={() => setIsFormStructured(true)}>
                            Guided
                        </StyledButton>
                        <StyledButton isActive={!isFormStructured} onClick={() => setIsFormStructured(false)}>
                            Custom
                        </StyledButton>
                    </Box>
                    {isFormStructured
                        ? <StucturedPromptForm attributes={structuredAttributes} onChange={setStructuredAttributes} />
                        : <CustomPromptForm attributes={customAttributes} onChange={setCustomAttributes} />
                    }
                    <FlexItem marginTop="xSmall">
                        <Button disabled={isPrompting} mobileWidth="auto" variant="secondary" onClick={() => void handleGenerateDescription()}>
                            Generate
                        </Button>
                    </FlexItem>
                </FlexItem>
                <Hr border="box" marginTop="xLarge" />
                <FullSizeContainer flexDirection="column" justifyContent="space-between">
                    {isPrompting && <Loader />}
                    {!isPrompting &&
                        <AiResults onChange={handleDescriptionChange} results={results} />
                    }
                    {!isPrompting &&
                        <FlexItem marginTop="xxLarge">
                            <Flex justifyContent="flex-end" flexDirection="row">
                                <Button mobileWidth="auto" variant="secondary">Cancel</Button>
                                <Button mobileWidth="auto" variant="primary">Use this</Button>
                            </Flex>
                        </FlexItem>
                    }
                </FullSizeContainer>
            </FullSizeContainer>
        </FullScreenHeightWrapper>
    );
}
