import React, { createContext, useContext, useState } from "react";
import { DEFAULT_GUIDED_ATTRIBUTES } from "~/constants";

export type PromptAttributes = GuidedAttributes | CustomAttributes;
export interface GuidedAttributes {
  style: string;
  wordCount: number;
  includeProductAttributes: boolean;
  optimizedForSeo: boolean;
  brandVoice: string;
  additionalAttributes: string;
  keywords: string;
  instructions: string;
}

export interface CustomAttributes {
  customPrompt: string;
  includeProductAttributes: boolean;
}

export const DEFAULT_CUSTOM_ATTRIBUTES: CustomAttributes = {
  customPrompt:
    "Short product description highlighting usage innovative environment-friendly materials. Include material names, tell about props of each and compare to the most popular ones. Add summary in a last paragraph. Make it sound professional and convincing.",
  includeProductAttributes: true
};

interface PromptAttributesContextType {
  currentAttributes: PromptAttributes;
  isFormGuided: boolean;
  guidedAttributes: GuidedAttributes;
  customAttributes: CustomAttributes;

  setIsFormGuided: (state: boolean) => void;
  setGuidedAttributes: (attr: GuidedAttributes) => void;
  setCustomAttributes: (attr: CustomAttributes) => void;
}

export const PromptAttributesContext =
  createContext<PromptAttributesContextType>({
    currentAttributes: DEFAULT_GUIDED_ATTRIBUTES,
    isFormGuided: true,
    guidedAttributes: DEFAULT_GUIDED_ATTRIBUTES,
    customAttributes: DEFAULT_CUSTOM_ATTRIBUTES,

    setIsFormGuided: () => undefined,
    setGuidedAttributes: () => undefined,
    setCustomAttributes: () => undefined
  });

export const PromptAttributesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isFormGuided, setIsFormGuided] = useState(true);

  const [guidedAttributes, setGuidedAttributes] = useState(
    DEFAULT_GUIDED_ATTRIBUTES
  );
  const [customAttributes, setCustomAttributes] = useState(
    DEFAULT_CUSTOM_ATTRIBUTES
  );

  const currentAttributes = isFormGuided ? guidedAttributes : customAttributes;

  const contextValue = {
    currentAttributes,
    isFormGuided,
    guidedAttributes,
    customAttributes,
    setIsFormGuided,
    setGuidedAttributes,
    setCustomAttributes
  };

  return (
    <PromptAttributesContext.Provider value={contextValue}>
      {children}
    </PromptAttributesContext.Provider>
  );
};

export const usePromptAttributes = () => useContext(PromptAttributesContext);
