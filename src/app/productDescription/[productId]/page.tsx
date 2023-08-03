import { Suspense } from 'react';
import Loader from '~/components/Loader';
import Generator from './generator';
import { fetchProductWithAttributes } from '~/server/bigcommerce-api';
import generateDescription from '~/server/google-ai';
import { authorize } from 'lib/authorize';
import * as db from 'lib/db';
interface PageProps {
    params: { productId: string; };
    searchParams: { product_name: string; };
}

export default async function Page(props: PageProps) {
    const { productId } = props.params;
    const { product_name: name } = props.searchParams;

    const auth = authorize();

    if (!auth) {
        throw new Error('JWT properties invalid');
    }

    const accessToken = await db.getStoreToken(auth.storeHash);

    if (!accessToken) {
        throw new Error('Access token not found. Try to re-install the app.');
    }

    const id = Number(productId);

    // cover case when product is not created yet
    const product = id === 0
        ? { id, name: name || '' }
        : await fetchProductWithAttributes(id, accessToken, auth.storeHash);

    const description = await generateDescription({ product });

    return (
        <Suspense fallback={<Loader />}>
            <Generator initialDescription={description} product={product} />
        </Suspense>
    );
}
