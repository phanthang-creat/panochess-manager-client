interface OrderStatusType {
    name: string
    slug: string
    description?: string
}

interface GetOrderStatusQueryItemResponseDataType extends OrderStatusType {
    id: number
    createdAt: string
    updatedAt: string
}


export type {
    OrderStatusType,
    GetOrderStatusQueryItemResponseDataType
}