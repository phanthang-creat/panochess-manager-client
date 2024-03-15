import { GetBranchQueryItemResponseDataType } from "../branchType";

interface ProductQuantityType {
    productId: string;
    branchId: number;
    quantity: number;
}

interface GetProductQuantityQueryItemResponseDataType extends ProductQuantityType {
    id: string;
    branch: GetBranchQueryItemResponseDataType
    createdAt: string;
    updatedAt: string;
}

interface PostProductQuantityRequestBodyType extends ProductQuantityType {}

interface PatchProductQuantityRequestBodyType extends Partial<ProductQuantityType> {}

export type {
    ProductQuantityType,
    GetProductQuantityQueryItemResponseDataType,
    PostProductQuantityRequestBodyType,
    PatchProductQuantityRequestBodyType
} 
