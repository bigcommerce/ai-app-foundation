'use client';

import { PromptAttributesProvider } from '~/context/PromptAttributesContext';
import { useEffect, useState } from 'react';
import { type NewProduct, type Product } from 'types';
import Form from './form';
import { AppContext } from '~/context/AppContext';
import Loader from '~/components/Loader';

export default function Generator({
  product,
  storeHash,
  locale,
  context,
}: {
  product: Product | NewProduct;
  storeHash: string;
  locale: string;
  context: string;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isClient && <Loader minHeight="90vh" />}
      {isClient && (
        <AppContext.Provider value={{ locale, storeHash, context }}>
          <PromptAttributesProvider>
            <Form product={product} />
          </PromptAttributesProvider>
        </AppContext.Provider>
      )}
    </>
  );
}
