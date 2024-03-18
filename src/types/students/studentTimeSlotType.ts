import { GetTimeSlotQueryItemResponseDataType } from "../timeSlot/timeSlotType";

interface StudentTimeSlotType {
    studentId: string;
    timeSlotId: number;
    dayOfWeek: number;
}

interface GetStudentTimeSlotQueryItemResponseDataType extends StudentTimeSlotType {
    id: number;
    createdAt: string;
    updatedAt: string;
    timeSlot: GetTimeSlotQueryItemResponseDataType;
}

interface PostStudentTimeSlotRequestBodyType {
    timeSlotId: number;
    dayOfWeek: number;
}

interface PatchStudentTimeSlotRequestBodyType extends Partial<PostStudentTimeSlotRequestBodyType> {}

export type {
    StudentTimeSlotType,
    GetStudentTimeSlotQueryItemResponseDataType,
    PostStudentTimeSlotRequestBodyType,
    PatchStudentTimeSlotRequestBodyType
}