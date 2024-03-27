interface GetCourseResponseDataType {
    id: string
    name: string
    description: string
    numberOfSessions: number
    price: number
    status: number
    createdAt: string
    updatedAt: string
}

interface PostCourseRequestBodyType {
    name: string
    description: string
    numberOfSessions: number
    price: number
    status: number
}

interface PatchCourseRequestBodyType extends Partial<PostCourseRequestBodyType> {}

export type { 
    GetCourseResponseDataType,
    PostCourseRequestBodyType,
    PatchCourseRequestBodyType
}