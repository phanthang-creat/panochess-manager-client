
import { useQuery } from "@tanstack/react-query"
import { axios } from "~/configs"
import { GetStudentStatusQueryItemResponseDataType } from "~/types/students/studentStatusType"

// GET /students
const useGetStudentStatusesQuery = () => {
    return useQuery({
        queryKey: ['[GET] /student-status'],
        queryFn: () => axios.get<
            Array<GetStudentStatusQueryItemResponseDataType>
        >('/student-status'),
        select: (data) => data.data
    })
}

export {
    useGetStudentStatusesQuery
}