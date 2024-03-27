import { MetaResponseDataType } from "../metaType"
import { CourseRegistrationStatusType } from "./courseRegistrationStatusType"
import { GetCourseResponseDataType } from "./courseType"

interface CourseRegistrationDataType {
    courseId: string
    studentId: string
    courseFee: number
    amountPaid: number
    description: string
    statusId: number
}

interface GetCourseRegistrationQueryItemResponseDataType extends CourseRegistrationDataType {
    id: string
    createdAt: string
    updatedAt: string
    classStudentsCount: number
    course: GetCourseResponseDataType
    status: CourseRegistrationStatusType
}


interface GetListCourseRegistrationQueryItemResponseDataType {
    data: Array<GetCourseRegistrationQueryItemResponseDataType>
    meta: MetaResponseDataType
}

interface PostCourseRegistrationRequestBodyType {
    courseId: string
    studentId: string
    // courseFee: number | string
    amountPaid: number
    description: string
    statusId: number
}

interface PatchCourseRegistrationRequestBodyType {
    amountPaid?: number
    description?: string
    statusId?: number
}

export type { 
    CourseRegistrationDataType,
    GetCourseRegistrationQueryItemResponseDataType,
    GetListCourseRegistrationQueryItemResponseDataType,
    PostCourseRegistrationRequestBodyType,
    PatchCourseRegistrationRequestBodyType
}