import { fetchProduct, fetchCategories, fetchBrand } from "lib/client";
import { type Product } from "types";

export const fetchProductWithAttributes = async (id: number, accessToken: string, storeHash: string) => {
    const product = await fetchProduct(id, accessToken, storeHash);

    const [categories, brand] = await Promise.all([
        fetchCategories(product.categories, accessToken, storeHash),
        product.brand_id ? fetchBrand(product.brand_id, accessToken, storeHash) : null
    ]);

    return { ...product, id, brand, categoriesNames: categories.join(',') } as Product;
};
