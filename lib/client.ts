const fetchFromBigCommerceApi = async (path: string, accessToken: string, storeHash: string) => {
    const res = await fetch(`https://api.bigcommerce.com/stores/${storeHash}/v3${path}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'X-Auth-Token': accessToken,
        }
    });

    const data = await res.json();

    return data;
}

export async function fetchProduct(productId: number, accessToken: string, storeHash: string) {
    const params = new URLSearchParams({ include: 'videos,images,custom_fields' }).toString();
    const { data } = await fetchFromBigCommerceApi(`/catalog/products/${productId.toString()}?${params}`, accessToken, storeHash);

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
    const { data } = await fetchFromBigCommerceApi(`/catalog/categories?${params}`, accessToken, storeHash);

    return data.map(({ name }: { name: string }) => name) as string[];
}

export async function fetchBrand(brandId: number, accessToken: string, storeHash: string) {
    const { data } = await fetchFromBigCommerceApi(`/catalog/brands/${brandId}`, accessToken, storeHash);

    return data.name as string || '';
}
