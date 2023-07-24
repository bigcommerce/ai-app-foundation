import React, { createContext, useContext, useState } from 'react';

export type PromptAttributes = StructuredAttributes | CustomAttributes;
export interface StructuredAttributes {
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

export const DEFAULT_STRUCTURED_ATTRIBUTES: StructuredAttributes = {
  style: 'story',
  wordCount: 250,
  includeProductAttributes: true,
  optimizedForSeo: true,
  brandVoice: '',
  additionalAttributes: '',
  keywords: '',
  instructions: '',
};

export const DEFAULT_CUSTOM_ATTRIBUTES: CustomAttributes = {
  customPrompt: 'Short product description highlighting usage innovative environment-friendly materials. Include material names, tell about props of each and compare to the most popular ones. Add summary in a last paragraph. Make it sound professional and convincing.',
  includeProductAttributes: true,
};

interface PromptAttributesContextType {
  currentAttributes: PromptAttributes
  isFormStructured: boolean;
  structuredAttributes: StructuredAttributes;
  customAttributes: CustomAttributes;
  setIsFormStructured(state: boolean): void;
  setStructuredAttributes(attr: StructuredAttributes): void;
  setCustomAttributes(attr: CustomAttributes): void;
}

export const PromptAttributesContext = createContext<PromptAttributesContextType>({
  currentAttributes: DEFAULT_STRUCTURED_ATTRIBUTES,
  isFormStructured: true,
  structuredAttributes: DEFAULT_STRUCTURED_ATTRIBUTES,
  customAttributes: DEFAULT_CUSTOM_ATTRIBUTES,
  setIsFormStructured: () => undefined,
  setStructuredAttributes: () => undefined,
  setCustomAttributes: () => undefined,
});

export const PromptAttributesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFormStructured, setIsFormStructured] = useState(true);

  const [structuredAttributes, setStructuredAttributes] = useState(DEFAULT_STRUCTURED_ATTRIBUTES);
  const [customAttributes, setCustomAttributes] = useState(DEFAULT_CUSTOM_ATTRIBUTES);

  const currentAttributes = isFormStructured ? structuredAttributes : customAttributes;

  const contextValue = {
    currentAttributes,
    isFormStructured,
    structuredAttributes,
    customAttributes,
    setIsFormStructured,
    setStructuredAttributes,
    setCustomAttributes
  }

  return (
    <PromptAttributesContext.Provider value={contextValue}>
      {children}
    </PromptAttributesContext.Provider>
  );
};

export const usePromptAttributes = () => useContext(PromptAttributesContext);
