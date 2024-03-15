import { MetaResponseDataType, PageOptionsType } from "../metaType"
import { GetOrderDetailQueryItemResponseDataType, PostOrderDetailRequestBodyType } from "./orderDetailType"
import { GetOrderStatusQueryItemResponseDataType } from "./orderStatusType"

interface OrderType {
    name: string
    phone?: string
    email?: string
    address?: string
    description?: string
    total: number
    branchId: number
    statusId: number
}

interface GetOrderQuery extends PageOptionsType {
    name?: string
}

interface GetOrderQueryItemResponseDataType extends OrderType {
    id: string
    orderDetails: GetOrderDetailQueryItemResponseDataType[]
    orderStatus: GetOrderStatusQueryItemResponseDataType
    createdAt: string
    updatedAt: string
}

interface GetListOrdersQueryItemResponseDataType {
    data: Array<GetOrderQueryItemResponseDataType>
    meta: MetaResponseDataType
}

interface PostOrderRequestBodyType {
    name: string
    phone?: string
    email?: string
    address?: string
    description?: string
    branchId: number
    statusId: number
    orderDetails: Array<PostOrderDetailRequestBodyType>
}

interface PatchOrderRequestBodyType extends Partial<PostOrderRequestBodyType> {}

export type {
    OrderType,
    GetOrderQueryItemResponseDataType,
    GetListOrdersQueryItemResponseDataType,
    PostOrderRequestBodyType,
    PatchOrderRequestBodyType,
    GetOrderQuery
}