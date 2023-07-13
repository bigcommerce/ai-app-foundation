import useSWR from 'swr';
import { useSession } from '../context/session';
import { ErrorProps, ListItem } from '../types';

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

export function useProductInfo(pid: number, list?: ListItem[] | any) {
    const { context } = useSession();
    const params = new URLSearchParams({ context }).toString();

    let product: ListItem | undefined;

    if (list?.length) {
        product = list.find(item => item.id === pid);
    }

    // Conditionally fetch product if it doesn't exist in the list (e.g. deep linking)
    const { data, error } = useSWR(!product && context ? [`/api/products/${pid}`, params] : null, fetcher);

    return {
        product: product ?? data,
        isLoading: product ? false : (!data && !error),
        error,
    };
}
