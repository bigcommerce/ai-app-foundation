import { Suspense } from 'react';
import Loader from '~/components/Loader';
import Generator from './generator';
import { fetchProductWithAttributes } from '~/server/bigcommerce-api';
import generateDescription from '~/server/google-ai';

interface PageProps {
    params: { productId: string; };
    searchParams: { context?: string; product_name?: string; };
}

export default async function Page(props: PageProps) {
    const { productId } = props.params;
    const { context, product_name: name } = props.searchParams;

    const id = Number(productId);

    // cover case when product is not created yet
    const product = id === 0
        ? { id, name: name || '' }
        : await fetchProductWithAttributes(id, context || '');

    const description = await generateDescription({ product });

    return (
        <Suspense fallback={<Loader />}>
            <Generator initialDescription={description} product={product} />
        </Suspense>
    );
}
