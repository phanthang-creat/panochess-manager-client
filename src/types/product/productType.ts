import { MetaResponseDataType, PageOptionsType } from "../metaType"
import { GetProductCategoryQueryItemResponseDataType } from "../product-categories/productCategoryType"
import { GetProductQuantityQueryItemResponseDataType, PostProductQuantityRequestBodyType } from "./productQuantityType"

interface ProductType {
  name: string
  slug: string
  price: number
  avatar: string | null
  description: string | null
  categoryId: number
  status: number
}

interface GetProductQuery extends PageOptionsType {
  name?: string
}


interface GetProductQueryItemResponseDataType extends ProductType {
  id: string
  createdAt: string
  updatedAt: string
  category: GetProductCategoryQueryItemResponseDataType
  productQuantity: GetProductQuantityQueryItemResponseDataType[]
}

interface GetListProductsQueryItemResponseDataType {
  data: Array<GetProductQueryItemResponseDataType>
  meta: MetaResponseDataType
}

interface PostProductRequestBodyType extends ProductType {
  productQuantity: PostProductQuantityRequestBodyType[]
}

interface PatchProductRequestBodyType extends Partial<PostProductRequestBodyType> {}

export type {
  ProductType,
  GetProductQueryItemResponseDataType,
  PostProductRequestBodyType,
  GetListProductsQueryItemResponseDataType,
  PatchProductRequestBodyType,
  GetProductQuery
}
