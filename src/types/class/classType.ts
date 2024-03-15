import { PostClassTeacherRequestBodyType } from "./classTeacherType"

interface ClassDataType {
    startTime: string
    endTime: string
    classroomId: string
    statusId: number
    description?: string
}

interface PostClassRequestBodyType extends ClassDataType {
    classTeachers: PostClassTeacherRequestBodyType
}

interface PatchClassRequestBodyType extends Partial<PostClassRequestBodyType> {}

export type {
    ClassDataType,
    PostClassRequestBodyType,
    PatchClassRequestBodyType
}