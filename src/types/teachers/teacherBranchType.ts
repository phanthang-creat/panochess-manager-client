import { GetBranchQueryItemResponseDataType } from "../branchType"

interface TeacherBranchType {
    teacherId: string
    branchId: number
}

interface GetTeacherBranchQueryItemResponseDataType extends TeacherBranchType {
    id: number
    branch: GetBranchQueryItemResponseDataType
}

interface PostTeacherBranchRequestBodyType extends TeacherBranchType {}

interface PatchTeacherBranchRequestBodyType extends Partial<TeacherBranchType> {}

export type {
    TeacherBranchType,
    GetTeacherBranchQueryItemResponseDataType,
    PostTeacherBranchRequestBodyType,
    PatchTeacherBranchRequestBodyType
}