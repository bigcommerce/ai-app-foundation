import { getSession } from "lib/auth";
import { fetchProduct, fetchCategories, fetchBrand } from "lib/client";
import { type SessionContextProps, type Product } from "types";

export const fetchProductWithAttributes = async (id: number, context: string) => {
    const { accessToken, storeHash } = await getSession(context) as SessionContextProps;
    const product = await fetchProduct(id, accessToken, storeHash);

    const [categories, brand] = await Promise.all([
        fetchCategories(product.categories, accessToken, storeHash),
        product.brand_id ? fetchBrand(product.brand_id, accessToken, storeHash) : null
    ]);

    return { ...product, id, brand, categoriesNames: categories.join(',') } as Product;
};
