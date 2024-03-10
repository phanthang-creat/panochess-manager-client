import { GetBranchQueryItemResponseDataType } from "./branchType"

interface GetAccountQueryItemResponseDataType {
    id: string
    username: string
    password: string
    fullName: string
    status: number
    createdAt: string
    updatedAt: string
    branchId: number
    branch: GetBranchQueryItemResponseDataType
}

interface PostAccountRequestBodyType {
    username: string
    fullName: string
    branchId: number
}

interface PatchAccountRequestBodyType extends Partial<PostAccountRequestBodyType> {}

export type { 
    GetAccountQueryItemResponseDataType, 
    PostAccountRequestBodyType,
    PatchAccountRequestBodyType
}