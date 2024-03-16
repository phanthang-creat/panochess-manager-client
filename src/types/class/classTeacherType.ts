import { GetTeacherQueryItemResponseDataType } from "../teachers/teacherType"

interface ClassTeacherType {
    classId: string
    teacherId: string
}

interface GetClassTeacherQueryItemResponseDataType extends ClassTeacherType {
    id: string
    teacher: GetTeacherQueryItemResponseDataType
    createdAt: string
    updatedAt: string
}

interface PostClassTeacherRequestBodyType {
    teacherId: string
}

interface PatchClassTeacherRequestBodyType extends ClassTeacherType {}

export type {
    ClassTeacherType,
    GetClassTeacherQueryItemResponseDataType,
    PostClassTeacherRequestBodyType,
    PatchClassTeacherRequestBodyType
}