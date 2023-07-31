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
        <>
            <Flex flexDirection="column">
                <FlexItem>
                    <Box display="inline-flex" marginBottom="medium">
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
                    <FlexItem marginTop="small">
                        <Button disabled={isPrompting} mobileWidth="auto" variant="secondary" onClick={() => void handleGenerateDescription()}>
                            Generate
                        </Button>
                    </FlexItem>
                </FlexItem>
                <FlexItem marginTop="medium">
                    {isPrompting && <Loader />}
                    {!isPrompting && <AiResults onChange={handleDescriptionChange} results={results} />}
                </FlexItem>
            </Flex>
            {!isPrompting &&
                <FlexItem marginTop="xxLarge">
                    <Flex justifyContent="flex-end" flexDirection="row">
                        <Button mobileWidth="auto" variant="secondary">Cancel</Button>
                        <Button mobileWidth="auto" variant="primary">Use this</Button>
                    </Flex>
                </FlexItem>
            }
        </>
    );
}
