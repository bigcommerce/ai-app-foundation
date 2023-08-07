'use client';

import { PromptAttributesProvider } from '~/context/PromptAttributesContext';
import { useDescriptionsHistory } from '~/hooks';
import { useEffect, useState } from 'react';
import { type NewProduct, type Product } from 'types';
import { DEFAULT_GUIDED_ATTRIBUTES } from '~/constants';
import Form from './form';

export default function Generator({
  product,
  initialDescription,
}: {
  product: Product | NewProduct;
  initialDescription: string;
}) {
  const [isInitialLoad, setInitialLoad] = useState(false);
  const { setResults } = useDescriptionsHistory(product.id);

  useEffect(() => {
    setResults({
      description: initialDescription,
      promptAttributes: DEFAULT_GUIDED_ATTRIBUTES,
    });
    setInitialLoad(true);
  }, []);

  return (
    <PromptAttributesProvider>
      {isInitialLoad && <Form product={product} />}
    </PromptAttributesProvider>
  );
}
