import { GetTeacherQueryItemResponseDataType } from "../teachers/teacherType"
import { GetClassQueryItemResponseDataType } from "./classType"
// import { GetClassQueryItemResponseDataType } from "./classType"

interface ClassTeacherType {
    classId: string
    teacherId: string
}

interface QueryGetClassTeacherDataType {
    // classId?: string
    teacherId?: string
    month?: string
}

interface GetClassTeacherQueryItemResponseDataType extends ClassTeacherType {
    id: string
    teacher: GetTeacherQueryItemResponseDataType
    // class: GetClassQueryItemResponseDataType
    createdAt: string
    updatedAt: string
}

interface GetClassTeacherByTeacherQueryItemResponseDataType extends ClassTeacherType {
    id: string
    teacher: GetTeacherQueryItemResponseDataType
    class: GetClassQueryItemResponseDataType
    createdAt: string
    updatedAt: string
}


interface GetListClassTeacherQueryItemResponseDataType {
    data: Array<GetClassTeacherByTeacherQueryItemResponseDataType>
    meta: {
        totalItems: number
    }

}

interface PostClassTeacherRequestBodyType {
    teacherId: string
}

interface PatchClassTeacherRequestBodyType extends ClassTeacherType {}

export type {
    ClassTeacherType,
    GetClassTeacherQueryItemResponseDataType,
    PostClassTeacherRequestBodyType,
    PatchClassTeacherRequestBodyType,
    QueryGetClassTeacherDataType,
    GetListClassTeacherQueryItemResponseDataType,
    GetClassTeacherByTeacherQueryItemResponseDataType
}