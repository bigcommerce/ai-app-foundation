export interface NewProduct {
    id: number;
    name: string;
}
export interface Product extends NewProduct {
    brand: string;
    type: string;
    condition: boolean;
    weight: number;
    height: number;
    width: number;
    depth: number;
    categoriesNames: string;
    videosDescriptions: string;
    imagesDescriptions: string;
    custom_fields: { name: string; value: string; }[];
}
