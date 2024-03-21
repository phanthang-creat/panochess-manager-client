
// import { useQuery } from "@tanstack/react-query"
// import { axios } from "~/configs"
// import { GetStudentTimeSlotQueryItemResponseDataType } from "~/types/students/studentTimeSlotType"

// // GET /student-time-slots
// const useGetStudentTimeSlotQuery = () => {
//     return useQuery({
//         queryKey: ['[GET] /student-title'],
//         queryFn: () => axios.get<
//             Array<GetStudentTimeSlotQueryItemResponseDataType>
//         >('/student-title'),
//         select: (data) => data.data
//     })
// }

// export {
//     useGetStudentTimeSlotQuery
// }