import { MetaResponseDataType, PageOptionsType } from "../metaType";
import { StudentResponseDataType } from "../students/studentType";
import { GetClassQueryItemResponseDataType } from "./classType";

interface ClassStudentDataType {
    classId: string
    studentId: string
    courseId: string;
}

interface QueryClassStudentDataType extends PageOptionsType {
    classId: string
    studentId?: string
    courseId?: string
}

interface QueryClassStudentByStudentIdDataType {
    // classId: string
    // studentId?: string
    courseId?: string
}

interface GetClassStudentQueryItemResponseDataType extends ClassStudentDataType {
    id: string
    student: StudentResponseDataType
    class: GetClassQueryItemResponseDataType
    createdAt: string
    updatedAt: string
}

interface GetListClassStudentQueryResponseDataType {
    data: Array<GetClassStudentQueryItemResponseDataType>
    meta: MetaResponseDataType
}

interface PostClassStudentRequestBodyDataType {
    classId: string
    studentId: string
}

// interface PatchClassStudentRequestBodyDataType {
//     classId: string
//     studentId: string
// }

export type {
    ClassStudentDataType,
    QueryClassStudentDataType,
    QueryClassStudentByStudentIdDataType,
    GetClassStudentQueryItemResponseDataType,
    PostClassStudentRequestBodyDataType,
    GetListClassStudentQueryResponseDataType
    // PatchClassStudentRequestBodyDataType
}