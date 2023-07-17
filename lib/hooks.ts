import useSWR from 'swr';
import { useSession } from '../context/session';
import { ErrorProps, Product } from '../types';

async function fetcher([url, query]) {
    const res = await fetch(`${url}?${query}`);

    // If the status code is not in the range 200-299, throw an error
    if (!res.ok) {
        const { message } = await res.json();
        const error: ErrorProps = new Error(message || 'An error occurred while fetching the data.');
        error.status = res.status; // e.g. 500
        throw error;
    }

    return res.json();
}

export function useProductInfo(pid: number) {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();

    const { isLoading, data, error } = useSWR<Product>(context ? [`/api/products/${pid}`, params] : null, fetcher, { shouldRetryOnError: false, revalidateOnFocus: false });

    return {
        product: data,
        isLoading,
        error,
    };
}
