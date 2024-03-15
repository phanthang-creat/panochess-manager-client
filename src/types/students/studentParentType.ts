interface StudentParentType {
    fatherName: string | null,
    fatherPhone: string | null
    fatherEmail: string | null
    motherName: string | null
    motherPhone: string | null
    motherEmail: string | null
    address: string | null
    description: string | null
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