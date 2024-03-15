interface ProductCategoryType {
    slug: string
    name: string
    description: string | null
}

interface GetProductCategoryQueryItemResponseDataType extends ProductCategoryType {
    id: string
}

interface PostProductCategoryRequestBodyType extends ProductCategoryType {}

interface PatchProductCategoryRequestBodyType extends Partial<ProductCategoryType> {}

export type {
    ProductCategoryType,
    GetProductCategoryQueryItemResponseDataType,
    PostProductCategoryRequestBodyType,
    PatchProductCategoryRequestBodyType
}
