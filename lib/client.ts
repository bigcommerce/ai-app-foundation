
import { bigcommerceClient } from './auth';

export async function fetchProduct(productId: number, accessToken: string, storeHash: string) {
    const params = new URLSearchParams({ include: 'videos,images,custom_fields' }).toString();
    const bigcommerce = bigcommerceClient(accessToken, storeHash);
    const { data } = await bigcommerce.get(`/catalog/products/${productId.toString()}?${params}`);

    return {
        name: data.name as string,
        type: data.type as string,
        condition: data.condition as boolean,
        weight: data.weight as number,
        height: data.height as number,
        width: data.width as number,
        depth: data.depth as number,
        videosDescriptions: data.videos.map(({ description }: { description: string }) => description).join(','),
        imagesDescriptions: data.images.map(({ description }: { description: string }) => description).join(','),
        custom_fields: data.custom_fields as { name: string; value: string; }[],
        brand_id: data.brand_id as number | undefined,
        categories: data.categories as number[]
    };
}

export async function fetchCategories(categories: number[], accessToken: string, storeHash: string) {
    const params = new URLSearchParams({ 'id:in': categories.join(',') }).toString();
    const bigcommerce = bigcommerceClient(accessToken, storeHash);
    const { data } = await bigcommerce.get(`/catalog/categories?${params}`);

    return data.map(({ name }: { name: string }) => name) as string[];
}

export async function fetchBrand(brandId: number, accessToken: string, storeHash: string) {
    const bigcommerce = bigcommerceClient(accessToken, storeHash);
    const { data } = await bigcommerce.get(`/catalog/brands/${brandId}`);

    return data.name as string || '';
}
