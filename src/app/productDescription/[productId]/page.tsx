import { Suspense } from 'react';
import Loader from '~/components/Loader';
import { fetchProductWithAttributes } from '~/server/bigcommerce-api';
import generateDescription from '~/server/google-ai';
import { authorize } from '~/lib/authorize';
import * as db from '~/lib/db';
import Generator from './generator';

interface PageProps {
  params: { productId: string };
  searchParams: { product_name: string };
}

export default async function Page(props: PageProps) {
  const { productId } = props.params;
  const { product_name: name } = props.searchParams;

  const authorized = authorize();

  if (!authorized) {
    throw new Error('Token is not valid. Try to re-open the app.');
  }

  const accessToken = await db.getStoreToken(authorized.storeHash);

  if (!accessToken) {
    throw new Error('Access token not found. Try to re-install the app.');
  }

  const id = Number(productId);

  // cover case when product is not created yet
  const product =
    id === 0
      ? { id, name: name || '' }
      : await fetchProductWithAttributes(id, accessToken, authorized.storeHash);

  const description = await generateDescription({ product });

  return (
    <Suspense fallback={<Loader />}>
      <Generator initialDescription={description} product={product} />
    </Suspense>
  );
}
