interface ClassStatusDataType {
    name: string
}

interface GetClassStatusQueryItemResponseDataType extends ClassStatusDataType {
    id: number
}

export type {
    ClassStatusDataType,
    GetClassStatusQueryItemResponseDataType
}
