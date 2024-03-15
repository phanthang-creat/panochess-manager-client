interface MetaResponseDataType {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: boolean
    hasNextPage: boolean
}

interface PageOptionsType {
    page: number
    take: number
}

export type {
    MetaResponseDataType,
    PageOptionsType
}