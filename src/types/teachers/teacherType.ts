import { GetGenderQueryItemResponseDataType } from "../genderType"
import { MetaResponseDataType } from "../metaType"
import { TeacherBranchType } from "./teacherBranchType"

interface TeacherDataType {
    name: string
    genderId: number
    email: string
    phone: string
    differentPhone: string | null
    dob: string
    address: string
    elo: number
    description: string | null
    avatar: string | null
    statusId: number
    basicSalary: number
}

interface GetTeacherQueryItemResponseDataType extends TeacherDataType {
    id: string
    createdAt: string
    updatedAt: string
    branches: Array<TeacherBranchType> | null
    gender: GetGenderQueryItemResponseDataType
}

interface GetListTeachersQueryItemResponseDataType {
    data: Array<GetTeacherQueryItemResponseDataType>
    meta: MetaResponseDataType
}

interface PostTeacherRequestBodyType extends TeacherDataType {
    branchIds: Array<number> | null
}

export type {
    TeacherDataType,
    GetTeacherQueryItemResponseDataType,
    PostTeacherRequestBodyType,
    GetListTeachersQueryItemResponseDataType
}