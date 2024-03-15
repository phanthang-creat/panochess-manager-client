import { GetBranchQueryItemResponseDataType } from "../branchType"
import { GetCourseResponseDataType } from "../courseType"
import { GetGenderQueryItemResponseDataType } from "../genderType"
import { MetaResponseDataType } from "../metaType"
import { GetStudentParentQueryItemResponseDataType, StudentParentType } from "./studentParentType"
import { GetStudentStatusQueryItemResponseDataType } from "./studentStatusType"
import { GetStudentTitleQueryItemResponseDataType } from "./studentTitleType"

interface StudentDataType {
    name: string
    avatar?: string | null
    email?: string
    phone: string
    dob: string
    elo: number
    genderId: number
    titleId: number
    statusId: number
    parentId?: string
    branchId: number
    courseId: number | null
    description: string
}

interface StudentResponseDataType extends StudentDataType{
    id: string
    createdAt: string
    updatedAt: string
    course: GetCourseResponseDataType
    studentParent: GetStudentParentQueryItemResponseDataType
    studentTitle: GetStudentTitleQueryItemResponseDataType
    studentStatus: GetStudentStatusQueryItemResponseDataType
    gender: GetGenderQueryItemResponseDataType
    branch: GetBranchQueryItemResponseDataType
}

interface GetStudentQueryItemResponseDataType {
    data: Array<StudentResponseDataType>,
    meta: MetaResponseDataType
}

interface PostStudentRequestBodyType extends StudentDataType {
    parent: StudentParentType
}

interface PatchStudentRequestBodyType extends Partial<StudentDataType> {}

export type {
    GetStudentQueryItemResponseDataType,
    StudentResponseDataType,
    PostStudentRequestBodyType,
    PatchStudentRequestBodyType
}