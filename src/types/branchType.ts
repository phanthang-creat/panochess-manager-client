interface GetBranchQueryItemResponseDataType {
    id: number
    name: string
    slug: string
    address: string
    status: number
    createdAt: string
    updatedAt: string
}

interface PostBranchRequestBodyType {
    name: string
    slug: string
    address: string
    status: number
}

interface PatchBranchRequestBodyType extends Partial<PostBranchRequestBodyType> {}
export type {
    GetBranchQueryItemResponseDataType,
    PostBranchRequestBodyType,
    PatchBranchRequestBodyType
}