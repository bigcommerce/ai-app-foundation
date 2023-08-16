'use client';

import { PromptAttributesProvider } from '~/context/PromptAttributesContext';
import { useDescriptionsHistory } from '~/hooks';
import { useEffect, useState } from 'react';
import { type NewProduct, type Product } from 'types';
import { DEFAULT_GUIDED_ATTRIBUTES } from '~/constants';
import Form from './form';
import { AppContext } from '~/context/AppContext';

export default function Generator({
  product,
  initialDescription,
  storeHash,
  locale,
  context,
}: {
  product: Product | NewProduct;
  initialDescription: string;
  storeHash: string;
  locale: string;
  context: string;
}) {
  const [isInitialLoad, setInitialLoad] = useState(false);

  const { setResults } = useDescriptionsHistory(product.id);

  useEffect(() => {
    setResults({
      description: initialDescription,
      promptAttributes: DEFAULT_GUIDED_ATTRIBUTES,
    });
    setInitialLoad(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider value={{ locale, storeHash, context }}>
      <PromptAttributesProvider>
        {isInitialLoad && <Form product={product} />}
      </PromptAttributesProvider>
    </AppContext.Provider>
  );
}
