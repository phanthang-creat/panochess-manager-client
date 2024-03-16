// import { PostClassTeacherRequestBodyType } from "./classTeacherType"

import { GetClassroomQueryItemResponseDataType } from "../classroom/classroomType"
import { GetClassStatusQueryItemResponseDataType } from "./classStatusType"
import { GetClassTeacherQueryItemResponseDataType } from "./classTeacherType"

interface ClassDataType {
    startTime: string
    endTime: string
    classroomId: string
    statusId: number
    description?: string
}

interface GetClassQueryItemResponseDataType extends ClassDataType {
    id: string
    classroom: GetClassroomQueryItemResponseDataType
    classTeachers: GetClassTeacherQueryItemResponseDataType[]
    classStatus: GetClassStatusQueryItemResponseDataType
    createdAt: string
    updatedAt: string
}

interface PostClassRequestBodyType extends ClassDataType {
    classTeachers: {
        teacherId: string
    }[]
}

interface PatchClassRequestBodyType extends Partial<PostClassRequestBodyType> {}

export type {
    ClassDataType,
    GetClassQueryItemResponseDataType,
    PostClassRequestBodyType,
    PatchClassRequestBodyType
}