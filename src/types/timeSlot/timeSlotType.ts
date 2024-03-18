interface TimeSlotType {
    start: string;
    end: string;
}

interface GetTimeSlotQueryItemResponseDataType extends TimeSlotType {
    id: string;
    createdAt: string;
    updatedAt: string;
}

interface PostTimeSlotRequestBodyType extends TimeSlotType {}

interface PatchTimeSlotRequestBodyType extends Partial<TimeSlotType> {}

export type {
    TimeSlotType,
    GetTimeSlotQueryItemResponseDataType,
    PostTimeSlotRequestBodyType,
    PatchTimeSlotRequestBodyType
}