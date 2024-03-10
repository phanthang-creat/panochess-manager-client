interface StudentParentType {
    fatherName: string
    fatherPhone: string
    fatherEmail: string
    motherName: string
    motherPhone: string
    motherEmail: string
    address: string
    description: string
}

interface GetStudentParentQueryItemResponseDataType extends StudentParentType{
    id: string
    branchId: number
    createdAt: string
    updatedAt: string
}

interface PostStudentParentRequestBodyType extends StudentParentType {}

interface PatchStudentParentRequestBodyType extends Partial<StudentParentType> {}

export type {
    StudentParentType,
    GetStudentParentQueryItemResponseDataType,
    PostStudentParentRequestBodyType,
    PatchStudentParentRequestBodyType
}