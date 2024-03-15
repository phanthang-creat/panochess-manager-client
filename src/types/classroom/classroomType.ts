import { GetBranchQueryItemResponseDataType } from "../branchType"

interface ClassroomType {
    name: string
    room: string
    branchId: string
    status: number
}

interface GetClassroomQueryItemResponseDataType extends ClassroomType {
    id: string
    branch?: GetBranchQueryItemResponseDataType    
}

interface PostClassroomRequestBodyType extends ClassroomType {}

interface PatchClassroomRequestBodyType extends Partial<PostClassroomRequestBodyType> {}

export type {
    ClassroomType,
    GetClassroomQueryItemResponseDataType,
    PostClassroomRequestBodyType,
    PatchClassroomRequestBodyType
}