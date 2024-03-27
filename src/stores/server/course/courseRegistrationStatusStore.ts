import { useQuery } from "@tanstack/react-query"
import { axios } from "~/configs"
import { CourseRegistrationStatusType } from "~/types/course/courseRegistrationStatusType"

const useGetCourseRegistrationStatusQuery = () => {
    return useQuery({
        queryKey: ['[GET] /course-registration-status'],
        queryFn: () => axios.get<Array<CourseRegistrationStatusType>>('/course-registration-status'),
        select: (data) => data.data
    })
}

export { useGetCourseRegistrationStatusQuery }