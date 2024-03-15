interface TeacherStatusType {
    name: string
}

interface GetTeacherStatusQueryItemResponseDataType extends TeacherStatusType {
    id: string
}

interface PostTeacherStatusRequestBodyType extends TeacherStatusType {}

interface PatchTeacherStatusRequestBodyType extends Partial<TeacherStatusType> {}

export type {
    TeacherStatusType,
    GetTeacherStatusQueryItemResponseDataType,
    PostTeacherStatusRequestBodyType,
    PatchTeacherStatusRequestBodyType
}
