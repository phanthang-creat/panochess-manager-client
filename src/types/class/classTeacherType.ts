interface ClassTeacherType {
    classId: string
    teacherId: string
}

interface PostClassTeacherRequestBodyType {
    teacherId: string
}

interface PatchClassTeacherRequestBodyType extends ClassTeacherType {}

export type {
    ClassTeacherType,
    PostClassTeacherRequestBodyType,
    PatchClassTeacherRequestBodyType
}