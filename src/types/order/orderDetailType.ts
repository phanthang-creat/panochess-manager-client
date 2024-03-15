import { GetProductQueryItemResponseDataType } from '~/types/product/productType';
interface OrderDetailType {
    orderId: string
    productId: string
    quantity: number
    price: number
}

interface GetOrderDetailQueryItemResponseDataType extends OrderDetailType {
    id: string
    product: GetProductQueryItemResponseDataType
    createdAt: string
    updatedAt: string
}

interface PostOrderDetailRequestBodyType {
    productId: string
    quantity: number
}

export type {
    OrderDetailType,
    GetOrderDetailQueryItemResponseDataType,
    PostOrderDetailRequestBodyType
}