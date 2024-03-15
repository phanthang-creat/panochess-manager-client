
import { useQuery } from "@tanstack/react-query"
import { axios } from "~/configs"
import { GetStudentTitleQueryItemResponseDataType } from "~/types/students/studentTitleType"

// GET /students
const useGetStudentTitlesQuery = () => {
    return useQuery({
        queryKey: ['[GET] /student-title'],
        queryFn: () => axios.get<
            Array<GetStudentTitleQueryItemResponseDataType>
        >('/student-title'),
        select: (data) => data.data
    })
}

export {
    useGetStudentTitlesQuery
}