import { fetchProductWithAttributes } from '~/server/bigcommerce-api';
import { authorize } from '~/lib/authorize';
import * as db from '~/lib/db';
import Generator from './generator';
import { headers } from 'next/headers';

interface PageProps {
  params: { productId: string };
  searchParams: { product_name?: string; exchangeToken?: string };
}

export default async function Page(props: PageProps) {
  const { productId } = props.params;
  const { product_name: name, exchangeToken } = props.searchParams;

  if (!exchangeToken) {
    // This typically happens when a product name contains an unencoded '#', which turns the rest of
    // the URL into a fragment (not sent to the server). The /api/app/load redirect now ensures the
    // exchangeToken is always appended before any fragment, but keep this guard to avoid a hard crash.
    throw new Error('Missing exchange token. Try to re-open the app.');
  }

  const authToken = await db.getClientTokenMaybeAndDelete(exchangeToken) || 'missing';

  const authorized = authorize(authToken);

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

  const csrfToken = headers().get('X-CSRF-Token') || 'missing';

  return (
    <Generator
      locale={headers().get('Accept-Language')?.split(',')[0] || ''}
      storeHash={authorized.storeHash}
      product={product}
      context="product_edit"
      csrfToken={csrfToken}
      authToken={authToken}
    />
  );
}
