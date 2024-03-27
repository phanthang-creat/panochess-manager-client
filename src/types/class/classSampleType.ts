import { GetTimeSlotQueryItemResponseDataType } from "../timeSlot/timeSlotType";

interface ClassSampleType {
    branchId: number;
    timeSlotId: number;
    dayOfWeekId: number;
}

interface GetClassSampleQueryItemResponse {
    id: number;
    branchId: number;
    timeSlotId: number;
    dayOfWeekId: number;
    timeSlot: GetTimeSlotQueryItemResponseDataType;
}

interface PostClassSampleRequestBodyType {
    branchId: number;
    timeSlotId: number;
    dayOfWeekId: number;
}

export type {
    ClassSampleType,
    GetClassSampleQueryItemResponse,
    PostClassSampleRequestBodyType
}