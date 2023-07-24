import { DEFAULT_STRUCTURED_ATTRIBUTES, PromptAttributesProvider } from '~/context/PromptAttributesContext';
import { type InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { prepareAiPromptAttributes } from '~/utils/utils';
import { caller } from '~/server/routers/_app';
import { fetchProductWithAttributes } from '~/server/bigcommerce-api';
import DescriptionGenerator from '~/containers/DescriptionGenerator';
import { useAIDescriptions } from '~/hooks';
import { useEffect, useState } from 'react';

export default dynamic(Promise.resolve(Page), { ssr: false })

function Page({ product, initialDescription }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isInitialLoad, setInitialLoad] = useState(false);

  const { setResults } = useAIDescriptions(product.id);

  useEffect(() => {
    setResults({ description: initialDescription, promptAttributes: DEFAULT_STRUCTURED_ATTRIBUTES });
    setInitialLoad(true);
  }, []);

  return (
    <PromptAttributesProvider>
      {isInitialLoad && <DescriptionGenerator product={product} />}
    </PromptAttributesProvider>
  );
}

type ReqProps = { query: { productId: string, product_name: string, context: string } };

export async function getServerSideProps({ query: { productId, context, product_name: name } }: ReqProps) {
  const id = Number(productId);

  // cover case when product is not created yet
  const product = id === 0
    ? { id, name }
    : await fetchProductWithAttributes(id, context);

  // Generate product description for the initial load
  const input = prepareAiPromptAttributes(DEFAULT_STRUCTURED_ATTRIBUTES, product);
  const initialDescription = await caller.generativeAi(input);

  return { props: { product, initialDescription } };
}
