
import { useQuery } from "@tanstack/react-query"
import { axios } from "~/configs"
import { GetTeacherStatusQueryItemResponseDataType } from "~/types/teachers/teacherStatusType"

// GET /teachers
const useGetTeacherStatusesQuery = () => {
    return useQuery({
        queryKey: ['[GET] /teacher-status'],
        queryFn: () => axios.get<
            Array<GetTeacherStatusQueryItemResponseDataType>
        >('/teacher-status'),
        select: (data) => data.data
    })
}

export {
    useGetTeacherStatusesQuery
}