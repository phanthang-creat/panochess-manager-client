import { MetaResponseDataType, PageOptionsType } from "../metaType";
import { StudentResponseDataType } from "../students/studentType";

interface ClassStudentDataType {
    classId: string
    studentId: string
    courseId: string;
}

interface QueryClassStudentDataType extends PageOptionsType {
    classId: string
    studentId?: string
}

interface GetClassStudentQueryItemResponseDataType extends ClassStudentDataType {
    id: string
    student: StudentResponseDataType
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
    GetClassStudentQueryItemResponseDataType,
    PostClassStudentRequestBodyDataType,
    GetListClassStudentQueryResponseDataType
    // PatchClassStudentRequestBodyDataType
}